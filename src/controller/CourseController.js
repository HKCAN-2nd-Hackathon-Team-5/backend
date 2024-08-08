//import databaseQuery from "../utility/DatabaseQuery.js";
import * as auth from '../utility/AuthFunc.js';
import pg from 'pg'
import * as outputObjectBuilder from '../utility/OutputObjectBuilder.js';
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
			.select()
			.order('start_date', { ascending: false });

		if (error) {
			res.status(status).json(error);
		}
		let result = {};
		let courses = [];
		for (var i = 0; i < data.length; i++) {
			let course = {
				"course_id": data[i].course_id,								
				"course_name": {
					"en": data[i].course_name_en,
					"zh_Hant": data[i].course_name_zh_hant,
					"zh": data[i].course_name_zh
				},
				  "tutor_name": data[i].tutor_name,
				  "venue": data[i].venue,
				  "start_date": data[i].start_date,
				  "end_date": data[i].end_date,
				  "weekday": data[i].weekday,
				  "except_date": data[i].except_date,
				  "start_time": data[i].start_time,
				  "end_time": data[i].end_time,
				  "capacity": data[i].capacity,
				  "price": data[i].price,
				  "age_min": data[i].age_min,
				  "age_max": data[i].age_max,
				  "min_attendance": data[i].min_attendance								
			}
			courses.push(course);
		}
		result = {
			"courses": courses,
		};
		

		res.status(status).json(result);
	}
}	 

// GET http://localhost:3008/api/v1/course/:id
export async function getCourseByCourseId(req, res) {
	let status = auth.allAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined) {
			res.sendStatus(500);
		}
		const { data, status, error } = await req.app.locals.db
			.from('dim_course')
			.select()
			.eq('course_id',req.params.id);
		
		if (error) {
			res.status(status).json(error);
		}
		
		let result = {};
		let courses = [];
		for (var i = 0; i < data.length; i++) {
			//select * from fct_payment p inner join dim_course c on p.course_id=c.course_id inner join dim_student s on s.student_id=a.student_id where p.payment_status in ('PAID');	//first_name, last_name, email, phone_no, emergency, 
			
			let course = {
				"course_id": data[i].course_id,								
				"course_name": {
					"en": data[i].course_name_en,
					"zh_Hant": data[i].course_name_zh_hant,
					"zh": data[i].course_name_zh
				},
				  "tutor_name": data[i].tutor_name,
				  "venue": data[i].venue,
				  "start_date": data[i].start_date,
				  "end_date": data[i].end_date,
				  "weekday": data[i].weekday,
				  "except_date": data[i].except_date,
				  "start_time": data[i].start_time,
				  "end_time": data[i].end_time,
				  "capacity": data[i].capacity,
				  "price": data[i].price,
				  "age_min": data[i].age_min,
				  "age_max": data[i].age_max,
				  "min_attendance": data[i].min_attendance								
			}
			courses.push(course);
		}
		result = {
			"courses": courses,
		};
		res.status(status).json(result);
	}
}

// UPDATE 
export function updateCourseByCourseId(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.body == undefined) {
			res.sendStatus(500);
		} else {
			const body = req.body;
			let q = {
				  text: `update dim_course 
						SET course_name_en=$2
						,course_name_zh_hant=$3
						,course_name_zh=$4
						,tutor_name=$5
						,venue=$6
						,start_date=$7
						,end_date=$8
						,weekday=$9
						,except_date=$10
						,start_time=$11
						,end_time=$12
						,capacity=$13
						,price=$14
						,age_min=$15
						,age_max=$16
						,min_attendance=$17
						WHERE course_id = $1`,
				  values: [body.course_id, body.course_name.en, body.course_name.zh_Hant, body.course_name.zh, body.tutor_name, body.venue, body.start_date, body.end_date, body.weekday, body.except_date, body.start_time, body.end_time, body.capacity, body.price, body.age_min, body.age_max, body.min_attendance],
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

//INSERT
export function createCourseByCourseId(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.body == undefined) {
			res.sendStatus(500);
		} else {
			const body = req.body;
			let q = {
				  text: `INSERT INTO dim_course 
						(course_name_en
						,course_name_zh_hant
						,course_name_zh
						,tutor_name
						,venue
						,start_date
						,end_date
						,weekday
						,except_date
						,start_time
						,end_time
						,capacity
						,price
						,age_min
						,age_max
						,min_attendance
						) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING course_id`,
				  values: [body.course_name.en, body.course_name.zh_Hant, body.course_name.zh, body.tutor_name, body.venue, body.start_date, body.end_date, body.weekday, body.except_date, body.start_time, body.end_time, body.capacity, body.price, body.age_min, body.age_max, body.min_attendance],
				};
			dbQuery(q).then((d)=>{
				console.log(d.rows[0].course_id);
				req.params.id = d.rows[0].course_id
				getCourseByCourseId(req, res);
			})
			.catch((error)=> {
				res.status(500).json(error);
			});
		}
	}
}

//DELETE
export function deleteCourseByCourseId(req, res) {
	let status = auth.adminAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined) {
			res.sendStatus(500);
		} else {
			let q = {
				  text: `DELETE FROM dim_course 
						WHERE course_id=$1`,
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

// GET http://localhost:3008/api/v1/course/:course_id/paid-student
export async function readPaidStudentsByCourseId(req, res) {
	const { data, status, error } = await req.app.locals.db
		.from('fct_application')
		.select(`
			dim_student(first_name, last_name, gender, dob, address, city, postal_code, phone_no, email),
			fct_payment!inner()
		`)
		.eq('fct_payment.payment_status', 'PAID')
		.contains('course_ids', [req.params.course_id]);

	if (error) {
		res.status(status).json(outputObjectBuilder.prependStatus(status, error, null));
		return;
	}

	for (let i = 0; i < data.length; i++) {
		const student = data[i].dim_student;

		data[i] = {
			first_name: student.first_name,
			last_name: student.last_name,
			gender: student.gender,
			dob: student.dob,
			address: student.address,
			city: student.city,
			postal_code: student.postal_code,
			phone_no: student.phone_no,
			email: student.email
		}
	}

	res.status(status).json(outputObjectBuilder.prependStatus(status, null, { students: data }));
}

//Get participant list (paid)-> insert to dim_participant_list (student_id, course_id)
/*select * from dim_student s
inner join dim_form f on (f.student_id=s.student_id)
inner join dim_form_course fc on (f.form_id=fc.form_id)
inner join dim_course c on (fc.course_id=c.course_id)
inner join dim_payment p on (p.
where c.course_id={}
;
*/
