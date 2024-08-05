import * as auth from '../utility/AuthFunc.js';
import pg from 'pg'
import format from 'pg-format';
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
			  "start_date": data.rows[i].start_date,
			  "end_date": data.rows[i].end_date,
			  "weekday": data.rows[i].weekday,
			  "except_date": data.rows[i].except_date,
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
				"start_date": data.rows[i].start_date,
				"end_date": data.rows[i].end_date,
				"courses": courses,
				"is_kid_form": data.rows[i].is_kid_form,
				"early_bird": {
					"end_date": data.rows[i].early_bird_end_date,
					"discount": data.rows[i].early_bird_discount
				},
				"ig_discount": data.rows[i].ig_discount,
				"add_questions": [
					{
						"en": data.rows[i].add_questions_en_1,
						"zh_Hant": data.rows[i].add_questions_zh_hant_1,
						"zh": data.rows[i].add_questions_zh_1
					},
					{
						"en": data.rows[i].add_questions_en_2,
						"zh_Hant": data.rows[i].add_questions_zh_hant_2,
						"zh": data.rows[i].add_questions_zh_2
					},
					{
						"en": data.rows[i].add_questions_en_3,
						"zh_Hant": data.rows[i].add_questions_zh_hant_3,
						"zh": data.rows[i].add_questions_zh_3
					},
					{
						"en": data.rows[i].add_questions_en_4,
						"zh_Hant": data.rows[i].add_questions_zh_hant_4,
						"zh": data.rows[i].add_questions_zh_4
					},
					{
						"en": data.rows[i].add_questions_en_5,
						"zh_Hant": data.rows[i].add_questions_zh_hant_5,
						"zh": data.rows[i].add_questions_zh_5
					}
				]
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
		let q1 = {
				  text: `select * from dim_form f
						inner join dim_form_course fc on (f.form_id=fc.form_id)
						inner join dim_course c on (c.course_id=fc.course_id)
						order by f.form_id`,
				  values: [],
				};
				
		dbQuery(q1).then((data)=>{
			res.status(status).json(getCourseInfo(data));
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
						  "start_date": data2.rows[i].start_date,
						  "end_date": data2.rows[i].end_date,
						  "weekday": data2.rows[i].weekday,
						  "except_date": data2.rows[i].except_date,
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
					"start_date": data.rows[0].start_date,
					"end_date": data.rows[0].end_date,
					"courses": courses,
					"is_kid_form": data.rows[0].is_kid_form,
					"early_bird": {
						"end_date": data.rows[0].early_bird_end_date,
						"discount": data.rows[0].early_bird_discount
					},
					"ig_discount": data.rows[0].ig_discount,
					"add_questions": [
						{
							"en": data.rows[0].add_questions_en_1,
							"zh_Hant": data.rows[0].add_questions_zh_hant_1,
							"zh": data.rows[0].add_questions_zh_1
						},
						{
							"en": data.rows[0].add_questions_en_2,
							"zh_Hant": data.rows[0].add_questions_zh_hant_2,
							"zh": data.rows[0].add_questions_zh_2
						},
						{
							"en": data.rows[0].add_questions_en_3,
							"zh_Hant": data.rows[0].add_questions_zh_hant_3,
							"zh": data.rows[0].add_questions_zh_3
						},
						{
							"en": data.rows[0].add_questions_en_4,
							"zh_Hant": data.rows[0].add_questions_zh_hant_4,
							"zh": data.rows[0].add_questions_zh_4
						},
						{
							"en": data.rows[0].add_questions_en_5,
							"zh_Hant": data.rows[0].add_questions_zh_hant_5,
							"zh": data.rows[0].add_questions_zh_5
						}
					]		
				};
				res.status(status).json(result);
			});
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
						,add_questions_en_1=$14
						,add_questions_zh_hant_1=$15
						,add_questions_zh_1=$16
						,add_questions_en_2=$17
						,add_questions_zh_hant_2=$18
						,add_questions_zh_2=$19
						,add_questions_en_3=$20
						,add_questions_zh_hant_3=$21
						,add_questions_zh_3=$22
						,add_questions_en_4=$23
						,add_questions_zh_hant_4=$24
						,add_questions_zh_4=$25
						,add_questions_en_5=$26
						,add_questions_zh_hant_5=$27
						,add_questions_zh_5=$28
						WHERE form_id = $1`,						
				  values: [body.form_id, body.title.en, body.title.zh_Hant, body.title.zh, body.desc.en, body.desc.zh_Hant, body.desc.zh, body.start_date, body.end_date, body.is_kid_form, body.early_bird.end_date, body.early_bird.discount, body.ig_discount, body.add_questions[0].en, body.add_questions[0].zh_Hant, body.add_questions[0].zh, body.add_questions[1].en, body.add_questions[1].zh_Hant, body.add_questions[1].zh, body.add_questions[2].en, body.add_questions[2].zh_Hant, body.add_questions[2].zh, body.add_questions[3].en, body.add_questions[3].zh_Hant, body.add_questions[3].zh, body.add_questions[4].en, body.add_questions[4].zh_Hant, body.add_questions[4].zh],
				};
			let q2 = {
				  text: `DELETE FROM dim_form_course 
						WHERE form_id=$1`,
				  values: [body.form_id],
				};
				
			dbQuery(q1).then((data)=>{
				dbQuery(q2).then((data2)=> {
					let courses = body.courses;
					let coursesToInsert = [];
					for (var i=0;i<courses.length;i++) {
						let course = {form_id: body.form_id, course_id: courses[i].course_id};
						coursesToInsert.push(course);
					}
					let q3 = format(`INSERT INTO dim_form_course (form_id ,course_id) VALUES  %L`, 
								coursesToInsert.map((course)=>[course.form_id, course.course_id]));	
								
					dbQuery(q3).then((data3)=> {
						console.log(data);
						res.status(status).json(data);
					});
				});
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
						) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27) RETURNING form_id`,
				  values: [body.title.en, body.title.zh_Hant, body.title.zh, body.desc.en, body.desc.zh_Hant, body.desc.zh, body.start_date, body.end_date, body.is_kid_form, body.early_bird.end_date, body.early_bird.discount, body.ig_discount, body.add_questions[0].en, body.add_questions[0].zh_Hant, body.add_questions[0].zh, body.add_questions[1].en, body.add_questions[1].zh_Hant, body.add_questions[1].zh, body.add_questions[2].en, body.add_questions[2].zh_Hant, body.add_questions[2].zh, body.add_questions[3].en, body.add_questions[3].zh_Hant, body.add_questions[3].zh, body.add_questions[4].en, body.add_questions[4].zh_Hant, body.add_questions[4].zh],
				};			
			dbQuery(q1).then((d)=>{
				req.params.id = d.rows[0].form_id;
				let courses = body.courses;
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
				});
			});
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
				});
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
			});
		}
	}
}