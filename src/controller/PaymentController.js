import * as auth from '../utility/AuthFunc.js';
import pg from 'pg'
import format from 'pg-format';
import fetch from 'node-fetch'
import * as outputObjectBuilder from '../utility/OutputObjectBuilder.js';
import * as autoEmailHelper from '../utility/AutoEmailHelper.js';
const { Pool, Client } = pg
const connectionString = process.env.DATABASE_URL;
const paypalUrl = process.env.PAYPAL_URL;
const paypalUsername = process.env.PAYPAL_USERNAME;
const paypalPassword = process.env.PAYPAL_PASSWORD;

export async function dbQuery(query){
	const pool = new Pool({
	  connectionString,
	})
	const res = await pool.query(query)
	await pool.end()
	return res;
}

async function authorization() {
	var auth = 'Basic ' + Buffer.from(paypalUsername + ':' + paypalPassword).toString('base64');

	const response = await fetch(paypalUrl+'/v1/oauth2/token', {
		method: 'POST',
		headers: {
			'Authorization': auth,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: 'grant_type=client_credentials'
	});
	const result = await response.json();
	return result;
}

async function getInvoiceNo(auth) {
	if (auth!=undefined) {
		const response = await fetch(paypalUrl+'/v2/invoicing/generate-next-invoice-number', {
		method: 'POST',
			headers: {
				'Authorization': 'Bearer ' +auth.access_token,
				'Content-Type': 'application/json'
			}
		});
		const result = await response.json();
		return result;
	} else {
		return "INVALID authorization";
	}
}

async function draftInvoice(auth, payment) {
	console.log(JSON.stringify(auth)+" " +JSON.stringify(payment));
	if (auth!=undefined) {
		const response = await fetch(paypalUrl+'/v2/invoicing/invoices', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' +auth.access_token,
				'Content-Type': 'application/json',
				'Prefer': 'return=representation'
			},
			body: JSON.stringify({
			  "detail": {
				"invoice_number": payment.invoice_no,
				"reference": payment.payment_id,
				"invoice_date": payment.invoice_date,
				"currency_code": "CAD",
				"note": "The classes are in-person.",
				"term": "Course Fees are non-refundable. However if the minimum number of participants are not reached, we will cancel the course and issue a full refund.\nLocation: Welcome Centre Immigrant Services, 7220 Kennedy Road, Unit 8, Markham, L3R",
				"memo": "",
				"payment_term": {
				  "term_type": "NO_DUE_DATE"//,	//NET_10: 10 days, NO_DUE_DATE, DUE_ON_DATE_SPECIFIED
				 // "due_date": payment.invoice_due_date
				}
			  },
			  "invoicer": {
				"name": {
				  "given_name": "CICS",
				  "surname": "Admin"
				},
				"address": {
				  "address_line_1": "Welcome Centre Immigrant Services, 7220 Kennedy Road, Unit 8",
				  "address_line_2": "",
				  "admin_area_2": "",		
				  "admin_area_1": "Markham",
				  "postal_code": "L3R",
				  "country_code": "CA"
				},
				"email_address": "sb-maiwu31461134@business.example.com",	//email
				"website": "https://cicscentreforlearning.ca",
				"logo_url": "https://cicscentreforlearning.ca/wp-content/uploads/2024/06/CICS_Logo.svg",
				"additional_notes": ""
			  },
			  "primary_recipients": [
				{
				  "billing_info": {
					"name": {
					  "given_name": payment.first_name,
					  "surname": payment.last_name
					},
					"address": {
					  "address_line_1": payment.address,
					  "admin_area_2": "",
					  "admin_area_1": payment.city,
					  "postal_code": payment.postal_code,
					  "country_code": "CA"
					},
					"email_address": payment.email,
					"phones": [
					  {
						"country_code": "001",
						"national_number": payment.phone_no,
						"phone_type": "MOBILE"
					  }
					]
				  }
				}
			  ],
			  "items": payment.courses,
			  "amount": {
				"breakdown": {
				  "discount": {
					"invoice_discount": {
					  "amount": {
						  "currency_code": "CAD",
						  "value": +payment.discount + +payment.used_credit
					  }
					}
				  }
				}
			  }
			})
		});
		const result = await response.json();		
		return result;
	} else {
		return "INVALID authorization";
	}
}

async function sendInvoice2(auth, paypalId) {
	console.log("sendInvoice2: "+paypalId);
	if (auth!=undefined && paypalId!=undefined) {
		const response = await fetch(paypalUrl+'/v2/invoicing/invoices/'+paypalId+'/send', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer '+auth.access_token,
				'Content-Type': 'application/json',
				'PayPal-Request-Id': 'b1d1f06c7246c'
			},
			body: JSON.stringify({ "send_to_invoicer": true })
		});
		const result = await response.json();
		return result;
	} else {
		return "Missing paypalId";
	}
}

async function getInvoiceDetails(auth, payments) {
    if (auth === undefined) {
        throw 'INVALID authorization';
    }

    const details = [];

    for (const payment of payments) {
        const response = await fetch(`${paypalUrl}/v2/invoicing/invoices/${payment.paypal_id}`, {
            headers: {
                'Authorization': `Bearer ${auth.access_token}`,
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        details.push({
            payment_id: payment.payment_id,
            status: json.status,
            payment_date: json.payments?.transactions[0].payment_date,
            method: json.payments?.transactions[0].method
        });
    }

    return details;
}

async function sendInvoice(paypalId) {
	await authorization()
	.then((auth)=>{
		console.log("sendInvoice with paypal_id" + paypalId);
		sendInvoice2(auth, paypalId)})
	.then((json)=>{
		return json;
	})
	.catch(()=> {
		return "500";
	});
}

function formatInvoice(invoice) {
	let courses = [];
	for (var i = 0; i < invoice.rows.length; i++) {
		let course = {
			"name": invoice.rows[i].course_name,
			"description": "",
			"quantity": "1",
			"unit_amount": {
				"currency_code": "CAD",
				"value": invoice.rows[i].price
			},
			"unit_of_measure": "QUANTITY"
		}		
		courses.push(course);
	}
	
	let payment = {
		"invoice_no": invoice.rows[0].invoice_no,
		"payment_id": invoice.rows[0].payment_id,
		"invoice_date": invoice.rows[0].invoice_date,
		"invoice_due_date": invoice.rows[0].invoice_due_date,
		"first_name": invoice.rows[0].first_name,
		"last_name": invoice.rows[0].last_name,
		"address": invoice.rows[0].address,
		"city": invoice.rows[0].city,
		"postal_code": invoice.rows[0].postal_code,
		"email": invoice.rows[0].email,
		"phone_no": invoice.rows[0].phone_no,
		"courses": courses,
		"discount": invoice.rows[0].discount,
		"used_credit": invoice.rows[0].used_credit
	};
	return payment;
}

async function createInvoice(invoice) {
	
	var result = null;
	await authorization()
	.then((auth)=>
		draftInvoice(auth, formatInvoice(invoice)))
	.then((json)=>{
		result = json.id;
	})
	.catch(()=> {
		return result;
	});
	return result;
}

async function generateInvoiceNo() {
	var invoice = null;
	await authorization()
	.then((auth)=>
		getInvoiceNo(auth))
	.then((json)=>{
		invoice = json.invoice_number;
	})
	.catch(()=> {
		return invoice;
	});
	return invoice;
}

export async function getPaymentByPaymentId(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined) {
			res.sendStatus(500);
		} else {
			const { data, status, error } = await req.app.locals.db
				.from('fct_payment')
				.select()
				.eq('payment_id', req.params.id);

			if (error) {
				res.status(status).json(error);
			}

			res.status(status).json(data[0]);
		}
	}
}

export async function updatePaymentByPaymentId(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.body == undefined) {
			res.sendStatus(500);
		} else {
			const body = req.body;
			let q = {
				  text: `update fct_payment 
						SET invoice_no = $2
						,invoice_date = $3
						,invoice_due_date = $4
						,application_id = $5
						,paypal_send = $6
						,paypal_id = $7
						,paid_date = $8,
						,payment_method = $9
						,payment_status = $10
						,last_updated_by = $11
						,last_updated_date = $12
						WHERE payment_id = $1`,
				  values: [body.payment_id, body.invoice_no, body.invoice_date, body.invoice_due_date, body.application_id, body.paypal_send, body.paypal_id, body.paid_date, body.payment_method, body.payment_status, 'Admin', new Date()],
				};
			dbQuery(q).then((data)=>{
				console.log(data);
				res.status(status).json(data);
			})
			.catch((error)=> {
				res.status(500).json(error);
			});
		}
	}
}

//create new payment
export async function createPayment(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		/*if (req.params.applicationid == undefined) {
			res.sendStatus(500);
		} else {*/
			//check any invoice generated?
			const { data, status, error } = await req.app.locals.db
				.from('fct_payment')
				.select()
				.eq('application_id', req.params.applicationid);

			if (error) {
				res.status(status).json(error);
			}
			
			if (data.length>0) {
				console.log(data);
				res.status(500).send("Invoice was generated on "+data[0].invoice_date+" previously.");
			} else {
				//call paypal to get invoice no.
				generateInvoiceNo()
				.then((invoiceNo)=>{
					console.log("invoiceNo: "+invoiceNo);
					let q1 = {
						text: `INSERT INTO fct_payment
								(invoice_no
								,application_id
								,invoice_date
								,created_by
								,created_date
								,last_updated_by
								,last_updated_date
								,invoice_due_date
								,paypal_send
								,payment_status
								) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) 
								RETURNING payment_id`,
						values: [invoiceNo, req.params.applicationid, new Date(), 'Admin', new Date(), 'Admin', new Date(), null, 'N', 'INITIAL'],
						};
					let q2 = {
						text: `select a.application_id, a.student_id, a.form_id, a.course_ids, a.price, a.used_credit, 
						(case when a.has_early_bird_discount then f.early_bird_discount else 0 end) + 
						(case when a.has_ig_discount then f.ig_discount else 0 end) +
						(case when a.has_return_discount then f.return_discount else 0 end) discount,
							s.first_name, s.last_name, s.email, s.address, s.city, s.postal_code, s.phone_no,
							p.payment_id, p.invoice_no, to_char(p.invoice_date,'YYYY-MM-DD') invoice_date, 
							to_char(p.invoice_due_date,'YYYY-MM-DD') invoice_due_date,
							case when lower(a.lang)='zh' then course_name_zh
								when lower(a.lang) like 'zh%hant' then course_name_zh_hant
								else course_name_en
							end course_name
							from fct_application a
							inner join dim_student s on (a.student_id=s.student_id)
							inner join fct_payment p on (a.application_id=p.application_id)
							inner join dim_form f on (a.form_id=f.form_id)
							inner join dim_course c on c.course_id = ANY(a.course_ids)
							where a.application_id=$1`,
						values: [req.params.applicationid],							
					};
					dbQuery(q1).then((paymentId)=>{
						dbQuery(q2).then((invoice)=>{
							createInvoice(invoice).then((paypal)=>{
								let q3 = {
									text: `update fct_payment
											set paypal_send = $2
											,paypal_id = $3
											,last_updated_by = $4
											,last_updated_date = $5
											,payment_status = $6
											where application_id=$1 
											RETURNING paypal_id`,
									values: [req.params.applicationid, 'P', paypal, 'Admin', new Date(), 'DRAFT'],
								};
								dbQuery(q3).then(()=>{
									//sent Invoice
									sendInvoice(paypal).then((d)=>{
										//update paypal sent status
										let q4 = {
											text: `update fct_payment
													set paypal_send = $2
													,last_updated_by = $3
													,last_updated_date =$4
													,payment_status = $5
													where application_id=$1
													RETURNING payment_id`,
											values: [req.params.applicationid, 'Y', 'Admin', new Date(), 'SENT'],
										};
										dbQuery(q4).then((payment)=>{
											req.params.id = payment.rows[0].payment_id;
											//call get payment
											//return payment information
											 getPaymentByPaymentId(req, res);
										})
										.catch((error)=> {
											res.status(500).json(error);
										});
									})
									.catch((error)=> {
										res.status(500).json(error);
									});
								})
								.catch((error)=> {
									res.status(500).json(error);
								});
							})
							.catch((error)=> {
								res.status(500).json(error);
							});
						})
						.catch((error)=> {
							res.status(500).json(error);
						});
					})
					.catch((error)=> {
						res.status(500).json(error);
					});
				})
				.catch((error)=> {
					res.status(500).json(error);
				});
		}
	}
}

//DELETE
export function deletePaymentByPaymentId(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined) {
			res.sendStatus(500);
		} else {
			let q = {
				  text: `DELETE FROM fct_payment 
						WHERE payment_id = $1`,
				  values: [req.params.id],
				};
			dbQuery(q).then((data)=>{
				console.log(data);
				res.status(status).json(data);
			})
			.catch((error)=> {
				res.status(500).json(error);
			});
		}
	}
}

// POST http://localhost:3008/api/v1/payment/invoice-check
export async function checkInvoices(req, res) {
	const authStatus = auth.adminAllow(req);

	if (authStatus !== 200) {
		res.sendStatus(authStatus);
		return;
	}

	let { data, status, error } = await req.app.locals.db
		.from('fct_payment')
		.select('payment_id, paypal_id')
		.in('payment_status', ['SENT', 'UNPAID']);

	if (error) {
		res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
		return;
	}

	const payments = []
	let isCheckFailed = false;

	await authorization()
		.then(auth => {
			return getInvoiceDetails(auth, data);
		})
		.then(details => {
			details.forEach(detail => {
				if (detail.status !== 'PAID' && detail.status !== 'MARKED_AS_PAID') {
					return;
				}

				payments.push({
					payment_id: detail.payment_id,
					payment_method: detail.method,
					payment_status: 'PAID',
					paid_date: detail.payment_date
				});
			});
		})
		.catch(error => {
			isCheckFailed = true;
			res.status(500).json(outputObjectBuilder.prependStatus(500, error.message, null));
		});

	if (isCheckFailed) {
		return;
	}

	({ data, status, error } = await req.app.locals.db
		.from('fct_payment')
		.upsert(payments)
		.select(`
			fct_application(
				dim_student(student_id, first_name, email, held_credit),
				form_id,
				lang,
				used_credit
			)
		`));

	if (error) {
		res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
		return;
	}

	const students = [];
	const formIds = new Set();
	const studentDetails = new Map();
	const formDetails = new Map();

	data.forEach(payment => {
		const application = payment.fct_application;
		const student = application.dim_student;
		students.push({
			student_id: student.student_id,
			held_credit: student.held_credit - application.used_credit
		});
		formIds.add(application.form_id);
		studentDetails.set(student.student_id, { first_name: student.first_name, email: student.email });
		formDetails.set(student.student_id, { form_id: application.form_id, lang: application.lang });
	});

	await req.app.locals.db
		.from('dim_student')
		.upsert(students);

	({ data } = await req.app.locals.db
		.from('dim_form')
		.select('form_id, title_en, title_zh_hant, title_zh')
		.in('form_id', Array.from(formIds)));

	const formTitles = new Map();

	data.forEach(form => {
		formTitles.set(form.form_id, form);
	})

	studentDetails.forEach((student, id) => {
		const form = formDetails.get(id);
		let lang;

		switch (form.lang.toLowerCase()) {
			case 'en':
				lang = 'title_en';
				break;
			case 'zh-hant':
			case 'zh_hant':
				lang = 'title_zh_hant';
				break;
			case 'zh':
				lang = 'title_zh';
				break;
		}

		autoEmailHelper.sendEnrollConfirm(student, formTitles.get(form.form_id)[lang], (error, info) => {
			if (error) {
				console.error(error);
				return;
			}

			console.log(info.response);
		});
	});

	res.status(200).json(outputObjectBuilder.prependStatus(200, null, { payments: payments }));
}
