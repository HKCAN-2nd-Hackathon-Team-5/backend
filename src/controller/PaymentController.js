import * as auth from '../utility/AuthFunc.js';
import pg from 'pg'
import format from 'pg-format';
import fetch from 'node-fetch'
const { Pool, Client } = pg
const connectionString = process.env.DATABASE_URL;
 

export async function dbQuery(query){
	const pool = new Pool({
	  connectionString,
	})
	const res = await pool.query(query)
	await pool.end()
	return res;
}

async function authorization() {
	var username = 'AUN6WOgoxL8tQpH35Di_RjjHVudjq8nlYi5UKSdJ8LqfLpmvxS9YMRUX77381a3TZV0KyRupphQzbxe0';
	var password = 'EMpaXP8s8mG8N22mFUVo_fXL-vTmQ8hFLwhsJEj49_nnUuDyH2R_oiO7j9uxFhHT6yliv6q0sQgYrbGk';
	var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

	const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
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
		const response = await fetch('https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number', {
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
	console.log(auth+" " +payment);
	if (auth!=undefined) {
		const response = await fetch('https://api-m.sandbox.paypal.com/v2/invoicing/invoices', {
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
				  "term_type": "DUE_ON_DATE_SPECIFIED",	//NET_10: 10 days, NO_DUE_DATE, DUE_ON_DATE_SPECIFIED
				  "due_date": payment.invoice_due_date
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
						"national_number": payment.phone,
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
						  "value": payment.discount
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

export async function createInvoice(req, res) {
	
	
	const { data, status, error } = await req.app.locals.db
			.from('dim_course')
			.select()
			.eq('course_id',req.body.course_ids);
		
	if (error) {
		res.status(status).json(error);
	}
	
	let courses = [];
	for (var i = 0; i < data.length; i++) {
		const courseName = "";
		if (lang == "zh") {
			courseName = data[i].course_name_en;
		} else if (lang == "zh_hant") {
			courseName = data[i].course_name_zh_hant;
		} else {
			courseName = data[i].course_name_zh;
		}
		let course = {
			"name": courseName,
			"description": "",
			"quantity": "1",
			"unit_amount": {
				"currency_code": "CAD",
				"value": data[i].price
			},
			"unit_of_measure": "QUANTITY"
		}		
		courses.push(course);
	}	
	
	let payment = {
			"invoice_no": req.body.invoice_no,
			"payment_id": req.body.payment_id,
			"invoice_date": "2024-08-06",
			"invoice_due_date": "2024-09-06",
			"first_name": req.body.first_name,
			"last_name": req.body.last_name,
			"address": req.body.address,
			"city": req.body.city,
			"postal_code": req.body.postal_code,
			"email": req.body.email,
			"phone": req.body.phone,
			"lang": req.body.lang,
			"courses": courses,
			"discount": req.body.discount
		};
		
	await authorization()
	.then((auth)=>{
		console.log("getNewInvoiceNo" + auth);
		draftInvoice(auth, payment)})
	.then((json)=>{
		console.log("testdraftInvoice: " + json);
		res.status(200).json(json);
	})
	.catch((error)=> {
		res.status(500).json(error);
	});
}

async function generateInvoiceNo() {
	var invoice = null;
	await authorization()
	.then((auth)=>
		getInvoiceNo(auth))
	.then((json)=>{
		invoice = "CL" + json.invoice_number;
		console.log("generateInvoiceNo: " + invoice);
	})
	.catch(()=> {
		return invoice;
	});
	return invoice;
}
/*
export async function getNewInvoiceNo(req, res) {
	await authorization()
	.then((auth)=>
		generateInvoiceNo(auth))
	.then((json)=>{
		let result = {
			"invoice_number": "CL"+json.invoice_number
		}
		res.status(200).json(result);
		
	});
}*/

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
						SET student_id = $2
						,form_id = $3
						,price = $4
						,used_credit = $5
						,first_name = $6
						,email = $7
						,last_updated_by = $8
						,last_updated_date = $9
						,invoice_no = $10
						,application_id = $11
						,course_ids = $12
						,invoice_date = $13
						,last_name = $14
						,address = $15
						,city = $16
						,postal_code = $17
						,discount = $18
						,invoice_due_date = $19,
						,paid_date = $20,
						,payment_method = $21
						,payment_status = $22
						WHERE payment_id = $1`,
				  values: [body.payment_id, body.student_id, body.form_id, body.price, body.used_credit, body.name, body.email, 'Admin', new Date(), body.invoice_no, body.application_id, body.course_ids, body.invoice_date, body.last_name, body.address, body.city, body.postal_code, body.discount, body.invoice_due_date, body.paid_date, body.payment_method, body.payment_status],
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
		if (req.body == undefined) {
			res.sendStatus(500);
		} else {
			generateInvoiceNo()
			.then((invoiceNo)=>{
				console.log("invoiceNo: "+invoiceNo);
				const body = req.body;
				let q = {
					  text: `INSERT INTO fct_payment
							(student_id
							,form_id
							,price
							,used_credit
							,first_name
							,email
							,created_by
							,created_date
							,last_updated_by
							,last_updated_date
							,invoice_no
							,application_id
							,course_ids
							,invoice_date
							,last_name
							,address
							,city
							,postal_code
							,discount
							,invoice_due_date
							) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20) RETURNING payment_id`,
					  values: [body.student_id, body.form_id, body.price, body.used_credit, body.first_name, body.email, 'Admin', new Date(), 'Admin', new Date(), invoiceNo, body.application_id, body.course_ids, new Date(), body.last_name, body.address, body.city, body.postal_code, body.discount, body.invoice_due_date],
					};
				dbQuery(q).then((d)=>{
					console.log(d.rows[0].payment_id);
					req.params.id = d.rows[0].payment_id
					//getPaymentByPaymentId(req, res);
					res.status(200).json(d);
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