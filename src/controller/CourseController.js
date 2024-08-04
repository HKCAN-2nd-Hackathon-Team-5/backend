//import databaseQuery from "../utility/DatabaseQuery.js";
import * as auth from '../utility/AuthFunc.js';
import pg from 'pg'
const { Pool, Client } = pg
const connectionString = process.env.DATABASE_URL;
 
/*const pool = new Pool({
  connectionString,
})
 
const res = await pool.query('SELECT NOW()')
console.log(res.rows[0])

await pool.end()
 
const client = new Client({
  connectionString,
})
 
await client.connect()
 
await client.query('SELECT NOW()')
 
await client.end()
*/

export async function dbQuery(query){
	const pool = new Pool({
	  connectionString,
	})
	const res = await pool.query(query)
	await pool.end()
	return res;
}

// GET http://localhost:3008/api/v1/course/
export async function getAllCourse(req, res) {
	let status = auth.allAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		const { data, status, error } = await req.app.locals.db
			.from('dim_course')
			.select();

		if (error) {
			res.status(status).json(error);
		}

		res.status(status).json(data);
	}
}	

// GET http://localhost:3008/api/v1/course/form/:id
export async function getAllCourseByFormId(req, res) {
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
							"zh-Hant": data2.rows[i].course_name_zh_hant,
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
						"zh-Hant": data.rows[0].title_zh_hant,
						"zh": data.rows[0].title_zh
					},
					"desc": {
						"en": data.rows[0].desc_en,
						"zh-Hant": data.rows[0].desc_zh_hant,
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
							"zh-Hant": data.rows[0].add_questions_zh_hant_1,
							"zh": data.rows[0].add_questions_zh_1
						},
						{
							"en": data.rows[0].add_questions_en_2,
							"zh-Hant": data.rows[0].add_questions_zh_hant_2,
							"zh": data.rows[0].add_questions_zh_2
						},
						{
							"en": data.rows[0].add_questions_en_3,
							"zh-Hant": data.rows[0].add_questions_zh_hant_3,
							"zh": data.rows[0].add_questions_zh_3
						},
						{
							"en": data.rows[0].add_questions_en_4,
							"zh-Hant": data.rows[0].add_questions_zh_hant_4,
							"zh": data.rows[0].add_questions_zh_4
						},
						{
							"en": data.rows[0].add_questions_en_5,
							"zh-Hant": data.rows[0].add_questions_zh_hant_5,
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
export function updateCourseByFormId(req, res) {
	let status = auth.allAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined) {
			res.sendStatus(500);
		}
		
		
	}
}
