import sql from 'mssql';
import databaseQuery from "../utility/DatabaseQuery.js";
import * as auth from '../utility/AuthFunc.js';

// GET http://localhost:3008/api/v1/course/:id
export function getAllCourseByFormId(req, res) {
	let status = auth.allAllow(req);
	if (status!=200) {
		res.sendStatus(status);
	} else {
		if (req.params.id == undefined) {
			res.sendStatus(500);
		}
		
		let result = {};
		let query1 = `select * from dim_form f
						WHERE f.form_id = ${req.params.id}`;
		
		let query2 = `select c.*, weekday, except_date
						from dim_form_course fc
						inner join dim_course c on (c.course_id=fc.course_id)
						inner join (select course_id, CONCAT('[', STRING_AGG(weekday, ','), ']') as weekday
									from dim_course_weekday
									group by course_id) cw on (c.course_id=cw.course_id)
						left join (select course_id, CONCAT('[', STRING_AGG(except_date, ','), ']') as except_date
									from dim_course_except_date
									group by course_id) ced on (c.course_id=ced.course_id)
						WHERE fc.form_id = ${req.params.id}`;

		databaseQuery(req.app.locals.db, query2, null, (error, data2) => {
			if (error) {
				console.error(error);
				res.sendStatus(500);
				return;
			} else{
				var courses = [];
				databaseQuery(req.app.locals.db, query1, null, (error, data) => {
					if (error) {
						console.error(error);
						res.sendStatus(500);
						return;
					} else{
						for (var i = 0; i < data2.recordset.length; i++) {
							let course = {
								"course_id": data2.recordset[i].course_id,								
								"course_name": {
									"en": data2.recordset[i].course_name_en,
									"zh-Hant": data2.recordset[i].course_name_zh_hant,
									"zh": data2.recordset[i].course_name_zh
								},
								  "tutor_name": data2.recordset[i].tutor_name,
								  "venue": data2.recordset[i].venue,
								  "start_date": data2.recordset[i].start_date,
								  "end_date": data2.recordset[i].end_date,
								  "weekday": data2.recordset[i].weekday,
								  "except_date": data2.recordset[i].except_date,
								  "start_time": data2.recordset[i].start_time,
								  "end_time": data2.recordset[i].end_time,
								  "capacity": data2.recordset[i].capacity,
								  "price": data2.recordset[i].price,
								  "age_min": data2.recordset[i].age_min,
								  "age_max": data2.recordset[i].age_max,
								  "min_attendance": data2.recordset[i].min_attendance								
							}
							courses.push(course);
						}
					}
					
					result = {
						"form_id": data.recordset[0].form_id,
						"title": {
							"en": data.recordset[0].title_en,
							"zh-Hant": data.recordset[0].title_zh_hant,
							"zh": data.recordset[0].title_zh
						},
						"desc": {
							"en": data.recordset[0].desc_en,
							"zh-Hant": data.recordset[0].desc_zh_hant,
							"zh": data.recordset[0].desc_zh
						},
						"start_date": data.recordset[0].start_date,
						"end_date": data.recordset[0].end_date,
						"courses": courses,
						"is_kid_form": data.recordset[0].is_kid_form,
						"early_bird": {
							"end_date": data.recordset[0].early_bird_end_date,
							"discount": data.recordset[0].early_bird_discount
						},
						"ig_discount": data.recordset[0].ig_discount,
						"add_questions": [
							{
								"en": data.recordset[0].add_questions_en_1,
								"zh-Hant": data.recordset[0].add_questions_zh_hant_1,
								"zh": data.recordset[0].add_questions_zh_1
							},
							{
								"en": data.recordset[0].add_questions_en_2,
								"zh-Hant": data.recordset[0].add_questions_zh_hant_2,
								"zh": data.recordset[0].add_questions_zh_2
							},
							{
								"en": data.recordset[0].add_questions_en_3,
								"zh-Hant": data.recordset[0].add_questions_zh_hant_3,
								"zh": data.recordset[0].add_questions_zh_3
							},
							{
								"en": data.recordset[0].add_questions_en_4,
								"zh-Hant": data.recordset[0].add_questions_zh_hant_4,
								"zh": data.recordset[0].add_questions_zh_4
							},
							{
								"en": data.recordset[0].add_questions_en_5,
								"zh-Hant": data.recordset[0].add_questions_zh_hant_5,
								"zh": data.recordset[0].add_questions_zh_5
							}
						]
						
					};
					res.status(200).send(result);
				});
			}
		});	
    }
}

