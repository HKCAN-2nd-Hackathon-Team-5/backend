import * as auth from '../utility/AuthFunc.js';
import pg from 'pg'
import format from 'pg-format';
import * as outputObjectBuilder from '../utility/OutputObjectBuilder.js';
import * as dateStringBuilder from '../utility/DateStringBuilder.js';
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

function getCourseInfo(data) {
	let result = [];
	let courses = [];
	for (var i = 0; i < data.rows.length; i++) {
		let course = {
			"course_id": data.rows[i].course_id,								
			"course_name": {
				"en": data.rows[i].course_name_en,
				"zh_Hant": data.rows[i].course_name_zh_hant,
				"zh": data.rows[i].course_name_zh
			},
			  "tutor_name": data.rows[i].tutor_name,
			  "venue": data.rows[i].venue,
			  "start_date": dateStringBuilder.trimTime(data.rows[i].cstart_date),
			  "end_date": dateStringBuilder.trimTime(data.rows[i].cend_date),
			  "weekday": data.rows[i].weekday,
			  "except_date": dateStringBuilder.trimTime(data.rows[i].except_date),
			  "start_time": data.rows[i].start_time,
			  "end_time": data.rows[i].end_time,
			  "capacity": data.rows[i].capacity,
			  "price": data.rows[i].price,
			  "age_min": data.rows[i].age_min,
			  "age_max": data.rows[i].age_max,
			  "min_attendance": data.rows[i].min_attendance								
		}
		courses.push(course);
		if (i==(data.rows.length-1) || (data.rows[i].form_id!=data.rows[i+1].form_id)) {
			let form = {
				"form_id": data.rows[i].form_id,
				"title": {
					"en": data.rows[i].title_en,
					"zh_Hant": data.rows[i].title_zh_hant,
					"zh": data.rows[i].title_zh
				},
				"desc": {
					"en": data.rows[i].desc_en,
					"zh_Hant": data.rows[i].desc_zh_hant,
					"zh": data.rows[i].desc_zh
				},
				"start_date": dateStringBuilder.trimTime(data.rows[i].start_date),
				"end_date": dateStringBuilder.trimTime(data.rows[i].end_date),
				"courses": courses,
				"is_kid_form": data.rows[i].is_kid_form,
				"early_bird": {
					"end_date": dateStringBuilder.trimTime(data.rows[i].early_bird_end_date),
					"discount": data.rows[i].early_bird_discount
				},
				"ig_discount": data.rows[i].ig_discount,
				"return_discount": data.rows[i].return_discount,
				"add_questions": {
					"q1": {
						"en": data.rows[i].add_questions_en_1,
						"zh_Hant": data.rows[i].add_questions_zh_hant_1,
						"zh": data.rows[i].add_questions_zh_1
					},
					"q2": {
						"en": data.rows[i].add_questions_en_2,
						"zh_Hant": data.rows[i].add_questions_zh_hant_2,
						"zh": data.rows[i].add_questions_zh_2
					},
					"q3": {
						"en": data.rows[i].add_questions_en_3,
						"zh_Hant": data.rows[i].add_questions_zh_hant_3,
						"zh": data.rows[i].add_questions_zh_3
					},
					"q4": {
						"en": data.rows[i].add_questions_en_4,
						"zh_Hant": data.rows[i].add_questions_zh_hant_4,
						"zh": data.rows[i].add_questions_zh_4
					},
					"q5": {
						"en": data.rows[i].add_questions_en_5,
						"zh_Hant": data.rows[i].add_questions_zh_hant_5,
						"zh": data.rows[i].add_questions_zh_5
					}
				}
			};
			result.push(form);
			courses = [];
		}		
	}
	return result;
}

// GET http://localhost:3008/api/v1/form/
export async function getAllForm(req, res) {
	let status = auth.allAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {		
		/*const { data, status, error } = await req.app.locals.db
			.from('dim_form')
			.select();
		
		if (error) {
			res.status(status).json(error);
		}
*/		

		let allFormSql = `select f.form_id, f.title_en, f.title_zh_hant, f.title_zh, f.desc_en, f.desc_zh_hant, f.desc_zh, 
						f.start_date start_date, f.end_date end_date, f.is_kid_form, 
						f.early_bird_end_date, f.early_bird_discount, f.ig_discount, f.return_discount,
						f.add_questions_en_1, f.add_questions_zh_hant_1, f.add_questions_zh_1, 
						f.add_questions_en_2, f.add_questions_zh_hant_2, f.add_questions_zh_2,
						f.add_questions_en_3, f.add_questions_zh_hant_3, f.add_questions_zh_3,
						f.add_questions_en_4, f.add_questions_zh_hant_4, f.add_questions_zh_4,
						f.add_questions_en_5, f.add_questions_zh_hant_5, f.add_questions_zh_5,
						c.course_id, c.course_name_en, c.course_name_zh_hant, c.course_name_zh,
						tutor_name, venue, c.start_date cstart_date, c.end_date cend_date,
						c.weekday, c.except_date,  c.start_time, c.end_time, c.capacity, c.price, c.age_min, c.age_max, c.min_attendance
						from dim_form f
						inner join dim_form_course fc on (f.form_id=fc.form_id)
						inner join dim_course c on (c.course_id=fc.course_id) `;
		if (auth.adminAllow(req)!=200) {
			//for public filter out inactive form
			allFormSql += `where current_date between f.start_date and f.end_date `
		}
		allFormSql += `order by f.form_id`;
		
		let q1 = {
				  text: allFormSql,
				  values: [],
				};
				
		dbQuery(q1).then((data)=>{
			res.status(status).json(getCourseInfo(data));
		})
		.catch((error)=> {
			res.status(500).json(error);
		});
	}
}	 

// GET http://localhost:3008/api/v1/form/:id
export async function getFormByFormId(req, res) {
	let status = auth.allAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined) {
			res.sendStatus(500);
		}
		let q1 = {
				  text: `select * from dim_form f WHERE f.form_id = $1`,
				  values: [req.params.id],
				};
		let q2 = {
				  text: `select c.*
							from dim_form_course fc
							inner join dim_course c on (c.course_id=fc.course_id)
							WHERE fc.form_id = $1`,
				  values: [req.params.id],
				};
		dbQuery(q1).then((data)=>{
			dbQuery(q2).then((data2)=>{
				let result = {};
				let courses = [];
				for (var i = 0; i < data2.rows.length; i++) {
					let course = {
						"course_id": data2.rows[i].course_id,								
						"course_name": {
							"en": data2.rows[i].course_name_en,
							"zh_Hant": data2.rows[i].course_name_zh_hant,
							"zh": data2.rows[i].course_name_zh
						},
						  "tutor_name": data2.rows[i].tutor_name,
						  "venue": data2.rows[i].venue,
						  "start_date": dateStringBuilder.trimTime(data2.rows[i].start_date),
						  "end_date": dateStringBuilder.trimTime(data2.rows[i].end_date),
						  "weekday": data2.rows[i].weekday,
						  "except_date": dateStringBuilder.trimTime(data2.rows[i].except_date),
						  "start_time": data2.rows[i].start_time,
						  "end_time": data2.rows[i].end_time,
						  "capacity": data2.rows[i].capacity,
						  "price": data2.rows[i].price,
						  "age_min": data2.rows[i].age_min,
						  "age_max": data2.rows[i].age_max,
						  "min_attendance": data2.rows[i].min_attendance								
					}
					courses.push(course);
				}
				result = {
					"form_id": data.rows[0].form_id,
					"title": {
						"en": data.rows[0].title_en,
						"zh_Hant": data.rows[0].title_zh_hant,
						"zh": data.rows[0].title_zh
					},
					"desc": {
						"en": data.rows[0].desc_en,
						"zh_Hant": data.rows[0].desc_zh_hant,
						"zh": data.rows[0].desc_zh
					},
					"start_date": dateStringBuilder.trimTime(data.rows[0].start_date),
					"end_date": dateStringBuilder.trimTime(data.rows[0].end_date),
					"courses": courses,
					"is_kid_form": data.rows[0].is_kid_form,
					"early_bird": {
						"end_date": dateStringBuilder.trimTime(data.rows[0].early_bird_end_date),
						"discount": data.rows[0].early_bird_discount
					},
					"ig_discount": data.rows[0].ig_discount,
					"return_discount": data.rows[0].return_discount,
					"add_questions": {
						"q1": {
							"en": data.rows[0].add_questions_en_1,
							"zh_Hant": data.rows[0].add_questions_zh_hant_1,
							"zh": data.rows[0].add_questions_zh_1
						},
						"q2": {
							"en": data.rows[0].add_questions_en_2,
							"zh_Hant": data.rows[0].add_questions_zh_hant_2,
							"zh": data.rows[0].add_questions_zh_2
						},
						"q3": {
							"en": data.rows[0].add_questions_en_3,
							"zh_Hant": data.rows[0].add_questions_zh_hant_3,
							"zh": data.rows[0].add_questions_zh_3
						},
						"q4": {
							"en": data.rows[0].add_questions_en_4,
							"zh_Hant": data.rows[0].add_questions_zh_hant_4,
							"zh": data.rows[0].add_questions_zh_4
						},
						"q5": {
							"en": data.rows[0].add_questions_en_5,
							"zh_Hant": data.rows[0].add_questions_zh_hant_5,
							"zh": data.rows[0].add_questions_zh_5
						}
					}		
				};
				res.status(status).json(result);
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

// UPDATE 
export function updateFormByFormId(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.body == undefined) {
			res.sendStatus(500);
		} else {
			const body = req.body;
			var earlyBirdEndDate = null;
			if (earlyBirdEndDate!== null) {
				earlyBirdEndDate = body.early_bird.end_date;
			}
			let q1 = {
				  text: `update dim_form 
						SET title_en=$2
						,title_zh_hant=$3
						,title_zh=$4
						,desc_en=$5
						,desc_zh_hant=$6
						,desc_zh=$7
						,start_date=$8
						,end_date=$9
						,is_kid_form=$10
						,early_bird_end_date=$11
						,early_bird_discount=$12
						,ig_discount=$13
						,return_discount=$14
						,add_questions_en_1=$15
						,add_questions_zh_hant_1=$16
						,add_questions_zh_1=$17
						,add_questions_en_2=$18
						,add_questions_zh_hant_2=$19
						,add_questions_zh_2=$20
						,add_questions_en_3=$21
						,add_questions_zh_hant_3=$22
						,add_questions_zh_3=$23
						,add_questions_en_4=$24
						,add_questions_zh_hant_4=$25
						,add_questions_zh_4=$26
						,add_questions_en_5=$27
						,add_questions_zh_hant_5=$28
						,add_questions_zh_5=$29
						WHERE form_id = $1`,						
				  values: [body.form_id, body.title.en, body.title.zh_Hant, body.title.zh, body.desc.en, body.desc.zh_Hant, body.desc.zh, body.start_date, body.end_date, body.is_kid_form, earlyBirdEndDate, body.early_bird.discount, body.ig_discount, body.return_discount, body.add_questions.q1.en, body.add_questions.q1.zh_Hant, body.add_questions.q1.zh, body.add_questions.q2.en, body.add_questions.q2.zh_Hant, body.add_questions.q2.zh, body.add_questions.q3.en, body.add_questions.q3.zh_Hant, body.add_questions.q3.zh, body.add_questions.q4.en, body.add_questions.q4.zh_Hant, body.add_questions.q4.zh, body.add_questions.q5.en, body.add_questions.q5.zh_Hant, body.add_questions.q5.zh],
				};
			dbQuery(q1).then((data)=>{
				let courses = body.courses;
				let coursesToInsert = [];
				let coursesToDelete = [];
				for (var i=0;i<courses.length;i++) {
					let course = {form_id: body.form_id, course_id: courses[i].course_id};
					coursesToInsert.push(course);
					coursesToDelete.push(courses[i].course_id);
				}
				if (courses.length == 0) {
					res.status(status).json(data);
				} else {
					let q2 = format(`INSERT INTO dim_form_course (form_id ,course_id) VALUES %L
									on conflict (form_id ,course_id) do nothing`, 
								coursesToInsert.map((course)=>[course.form_id, course.course_id]));	
								
					dbQuery(q2).then((data2)=> {
						let q3 = format(`DELETE FROM dim_form_course 
										where form_id=%L 
										AND course_id not in (%L)`,
								body.form_id, coursesToDelete);
							dbQuery(q3).then((data3)=> {
							res.status(status).json(data);
						})
						.catch((error)=> {
							res.status(500).json(error);
						});
					})
					.catch((error)=> {
						res.status(500).json(error);
					});
				}
			})
			.catch((error)=> {
				res.status(500).json(error);
			});
		}
	}
}

//INSERT
export function createFormByFormId(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.body == undefined) {
			res.sendStatus(500);
		} else {
			const body = req.body;
			var earlyBirdEndDate = null;
			if (earlyBirdEndDate!== null) {
				earlyBirdEndDate = body.early_bird.end_date;
			}
			let q1 = {
				  text: `INSERT INTO dim_form 
						(title_en
						,title_zh_hant
						,title_zh
						,desc_en
						,desc_zh_hant
						,desc_zh
						,start_date
						,end_date
						,is_kid_form
						,early_bird_end_date
						,early_bird_discount
						,ig_discount
						,return_discount
						,add_questions_en_1
						,add_questions_zh_hant_1
						,add_questions_zh_1
						,add_questions_en_2
						,add_questions_zh_hant_2
						,add_questions_zh_2
						,add_questions_en_3
						,add_questions_zh_hant_3
						,add_questions_zh_3
						,add_questions_en_4
						,add_questions_zh_hant_4
						,add_questions_zh_4
						,add_questions_en_5
						,add_questions_zh_hant_5
						,add_questions_zh_5
						) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28) RETURNING form_id`,
				  values: [body.title.en, body.title.zh_Hant, body.title.zh, body.desc.en, body.desc.zh_Hant, body.desc.zh, body.start_date, body.end_date, body.is_kid_form, earlyBirdEndDate, body.early_bird.discount, body.ig_discount, body.return_discount, body.add_questions.q1.en, body.add_questions.q1.zh_Hant, body.add_questions.q1.zh, body.add_questions.q2.en, body.add_questions.q2.zh_Hant, body.add_questions.q2.zh, body.add_questions.q3.en, body.add_questions.q3.zh_Hant, body.add_questions.q3.zh, body.add_questions.q4.en, body.add_questions.q4.zh_Hant, body.add_questions.q4.zh, body.add_questions.q5.en, body.add_questions.q5.zh_Hant, body.add_questions.q5.zh],
				};			
			dbQuery(q1).then((d)=>{
				req.params.id = d.rows[0].form_id;
				let courses = body.courses;
				if (courses.length==0) {
					getFormByFormId(req, res);
				} else {						
					let coursesToInsert = [];
					for (var i=0;i<courses.length;i++) {
						let course = {form_id: d.rows[0].form_id, course_id: courses[i].course_id};
						coursesToInsert.push(course);
					}
					let q2 = format(`INSERT INTO dim_form_course (form_id ,course_id) VALUES  %L`, 
									coursesToInsert.map((course)=>[course.form_id, course.course_id]));
									
					dbQuery(q2).then((d2)=> {
						console.log(d2);
						getFormByFormId(req, res);
					})
					.catch((error)=> {
						res.status(500).json(error);
					});
				}
			})
			.catch((error)=> {
				res.status(500).json(error);
			});;
		}
	}
}

//DELETE
export function deleteFormByFormId(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined) {
			res.sendStatus(500);
		} else {
			let q1 = {
				  text: `DELETE FROM dim_form_course 
						WHERE form_id=$1`,
				  values: [req.params.id],
				};
			let q2 = {
				  text: `DELETE FROM dim_form 
						WHERE form_id=$1`,
				  values: [req.params.id],
				};
			dbQuery(q1).then((data)=>{
				dbQuery(q2).then((data2)=>{
					res.status(status).json(data);
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

//ASSIGN COURSE TO FORM
export function assignCourseToForm(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined || req.params.courseid == undefined) {
			res.sendStatus(500);
		} else {
			let q = {
				  text: `INSERT INTO dim_form_course 
						(form_id
						,course_id
						) VALUES ($1,$2)`,
				  values: [req.params.id, req.params.courseid],
				};
			dbQuery(q).then((data)=>{
				res.status(status).json(data);
			})
			.catch((error)=> {
				res.status(500).json(error);
			});
		}
	}
}


//UNASSIGN COURSE FROM FORM
export function unassignCourseToForm(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined || req.params.courseid == undefined) {
			res.sendStatus(500);
		} else {
			let q = {
				  text: `DELETE FROM dim_form_course 
						WHERE form_id=$1 
						AND course_id=$2`,
				  values: [req.params.id, req.params.courseid],
				};
			dbQuery(q).then((data)=>{
					res.status(status).json(data);
			})
			.catch((error)=> {
				res.status(500).json(error);
			});
		}
	}
}

// GET http://localhost:3008/api/v1/form/:form_id/application
export async function readApplicationsByFormId(req, res) {
	const authStatus = auth.adminAllow(req);

	if (authStatus !== 200) {
		res.sendStatus(authStatus);
		return;
	}

	const { data, status, error } = await req.app.locals.db
		.from('fct_application')
		.select()
		.eq('form_id', req.params.form_id);

	if (error) {
		res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
		return;
	}

	res.status(status).json(outputObjectBuilder.prependStatus(status, null, { applications: data }));
}

// GET http://localhost:3008/api/v1/form/:form_id/student-payment
export async function readStudentsPaymentsByFormId(req, res) {
	const { data, status, error } = await req.app.locals.db
		.from('fct_application')
		.select('dim_student!inner(first_name, last_name, phone_no, email), fct_payment(payment_status, invoice_no)')
		.eq('form_id', req.params.form_id)

	if (error) {
		res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
	}

	const studentsPayments = [];

	data.forEach(datum => {
		const studentPayment = {
			student_first_name: datum.dim_student.first_name,
			student_last_name: datum.dim_student.last_name,
			student_phone_no: datum.dim_student.phone_no,
			student_email: datum.dim_student.email
		}

		if (datum.fct_payment.length > 0) {
			studentPayment.payment_invoice_no = datum.fct_payment[0].invoice_no;
			studentPayment.payment_status = datum.fct_payment[0].payment_status;
		} else {
			studentPayment.payment_invoice_no = null;
			studentPayment.payment_status = 'NOT_INIT';
		}

		studentsPayments.push(studentPayment);
	})

	res.status(status).json(outputObjectBuilder.prependStatus(status, null, { data: studentsPayments }));
}
