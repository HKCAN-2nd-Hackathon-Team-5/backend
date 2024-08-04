IF DB_ID('cics_database') IS NULL
    CREATE DATABASE cics_database;
GO
USE cics_database;
-- student_id with composite key of CONCAT(phone_no,' ',first_name)
CREATE TABLE dim_student (
	student_id 		int IDENTITY(1,1) PRIMARY KEY
	,first_name		nvarchar(50) NOT NULL
	,last_name 		nvarchar(50) NOT NULL
	,gender 		nvarchar(50) NOT NULL
	,dob 			date
	,address 		nvarchar(100)
	,city 			nvarchar(50)
	,postal_code	char(6)
	,phone_no 		bigint
	,email 			varchar(100)
	,credit_balance decimal(38,6) DEFAULT 0
	);
-- depends if CICS have course code as id
CREATE TABLE dim_course (
	course_id int 			IDENTITY(1,1) PRIMARY KEY
	,course_name_en 		varchar(200)
	,course_name_zh_hant	varchar(200)
	,course_name_zh      	varchar(200)
	,tutor_name          	nvarchar(100)
	,venue               	nvarchar(50)
	,start_date          	date
	,end_date            	date
	,start_time          	time(7)
	,end_time            	time(7)
	,capacity            	int
	,price               	decimal(38,6)
	,age_min             	int
	,age_max             	int
	,min_attendance      	int
    );
-- store array weekday for course
CREATE TABLE dim_course_weekday (
	course_weekday_id	int IDENTITY(1,1) PRIMARY KEY
	,course_id 			int
	,weekday			char
    );
-- store array except date for course if ANY
CREATE TABLE dim_course_except_date (
	course_except_date_id	int IDENTITY(1,1) PRIMARY KEY
	,course_id 				int
	,except_date			date
    ); 	
-- application form setup
CREATE TABLE dim_form (
	form_id int 				IDENTITY(1,1) PRIMARY KEY
	,title_en		 			varchar(255)
	,title_zh_hant				nvarchar(255)
	,title_zh		      		varchar(255)
	,desc_en	          		varchar(1000)
	,desc_zh_hant          		nvarchar(1000)
	,desc_zh	          		nvarchar(1000)
	,start_date          		date
	,end_date            		date
	,is_kid_form				char
	,early_bird_end_date		date
	,early_bird_discount		decimal(38,6)
	,ig_discount				decimal(38,6)
	,add_questions_en_1			varchar(1000)
	,add_questions_zh_hant_1	nvarchar(1000)
	,add_questions_zh_1			nvarchar(1000)
	,add_questions_en_2			varchar(1000)
	,add_questions_zh_hant_2	nvarchar(1000)
	,add_questions_zh_2			nvarchar(1000)
	,add_questions_en_3			varchar(1000)
	,add_questions_zh_hant_3	nvarchar(1000)
	,add_questions_zh_3			nvarchar(1000)
	,add_questions_en_4			varchar(1000)
	,add_questions_zh_hant_4	nvarchar(1000)
	,add_questions_zh_4			nvarchar(1000)
	,add_questions_en_5			varchar(1000)
	,add_questions_zh_hant_5	nvarchar(1000)
	,add_questions_zh_5			nvarchar(1000)
    );
--assign course to application form for setup
CREATE TABLE dim_form_course (
	form_id 	int
	,course_id	int
    ); 
--student application
CREATE TABLE fct_application (
	application_id 		     int IDENTITY(1,1) PRIMARY KEY
	,student_id 		     int
	,form_id 			     int
	,lang				     varchar(10)
	,special			     nvarchar(255)
	,parent_name		     nvarchar(100)
	,parent_relation	     nvarchar(50)
	,emergency_name		     nvarchar(100)
	,emergency_relation	     nvarchar(50)
	,emergency_phone_no	     bigint
	,self_leave_name	     nvarchar(100)
	,self_leave_phone_no     bigint
	,residency_status	     nvarchar(50)
	,residency_origin	     nvarchar(50)
	,residency_stay		     decimal(38,6)
	,ig_username		     varchar(30)
	,add_answers_1		     nvarchar(255)
	,add_answers_2		     nvarchar(255)
	,add_answers_3		     nvarchar(255)
	,add_answers_4		     nvarchar(255)
	,add_answers_5		     nvarchar(255)
	,consent_name		     nvarchar(100)
	,consent_phone_no	     bigint
	,remark				     nvarchar(1000)
	,submit_time		     datetime
	,has_early_bird_discount char(1)
	,has_ig_discount		 char(1)
	,deduct_credit			 decimal(38,6)
	,price					 decimal(38,6)
	);
--take which course on the application
CREATE TABLE dim_application_course (
	application_id 	int
	,course_id		int
    ); 
	
--generated payment after submission
CREATE TABLE fct_payment (
	payment_id 			int IDENTITY(1,1) PRIMARY KEY
	,student_id			int
	,form_id			int
	,invoice			varchar(20)
	/*,price				decimal(38,6)
	,used_credit		decimal(38,6) DEFAULT 0
	,name				nvarchar(100)
	,email				varchar(100)*/
	,payment_method		varchar(20)
	,payment_status		char(1)
	,paid_date			datetime
	,created_by			varchar(100)
	,created_date		datetime
	,last_updated_by	varchar(100)
	,last_updated_date	datetime
    );
	
--create index to improve performance
CREATE INDEX index_student ON dim_student (student_id);
CREATE INDEX index_course ON dim_course (course_id);
CREATE INDEX index_course_weekday ON dim_course_weekday (course_weekday_id);
CREATE INDEX index_course_except_date ON dim_course_except_date (course_except_date_id);
CREATE INDEX index_form ON dim_form (form_id);
CREATE UNIQUE INDEX index_form_course ON dim_form_course (form_id, course_id);
CREATE INDEX index_application ON fct_application (application_id);
CREATE UNIQUE INDEX index_application_course ON dim_application_course (application_id, course_id);
CREATE INDEX index_payment ON fct_payment (payment_id);

	
--Test cases created for dim_student table
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST1', 'LAST', 'M','19990131','Address', 'city', 'M2J0G4', 4370000001, 'test1@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST2', 'LAST', 'M','19990131','Address', 'city', 'M2J0G4', 4370000002, 'test2@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST3', 'LAST', 'M','19990131','Address', 'city', 'M2J0G4', 4370000003, 'test3@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST4', 'LAST', 'M','19990131','Address', 'city', 'M2J0G4', 4370000004, 'test4@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST5', 'LAST', 'M','19990131','Address', 'city', 'M2J0G4', 4370000005, 'test5@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST6', 'LAST', 'F','20140131','Address', 'city', 'M2J0G4', 4370000006, 'test6@test.com');

--Test cases created for dim_course table
INSERT INTO dim_course (course_name_en,course_name_zh_hant,course_name_zh,tutor_name,venue,start_date,end_date,start_time,end_time,capacity,price,age_min,age_max,min_attendance) VALUES ('COURSE1','課程(繁)1','課程(簡)1','tutor1','CICS room 1','20240812','20240823','10:30:00','12:30:00',10,100,6,18,2);
INSERT INTO dim_course (course_name_en,course_name_zh_hant,course_name_zh,tutor_name,venue,start_date,end_date,start_time,end_time,capacity,price,age_min,age_max,min_attendance) VALUES ('COURSE2','課程(繁)2','課程(簡)2','tutor2','CICS room 2','20240812','20240816','10:30:00','12:30:00',20,50,18,null,1);

--Test case created for dim_course_weekday table
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (1, 1);
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (1, 3);
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (1, 5);
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (2, 2);
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (2, 4);

--Test case created for dim_course_except_date table (if having any)
INSERT INTO dim_course_except_date (course_id, except_date) VALUES (1, '20240814');

--Test cases created for dim_form table
INSERT INTO dim_form (title_en,title_zh_hant,title_zh,desc_en,desc_zh_hant,desc_zh,start_date,end_date,is_kid_form,early_bird_end_date,early_bird_discount,ig_discount,add_questions_en_1,add_questions_zh_hant_1,add_questions_zh_1,add_questions_en_2,add_questions_zh_hant_2,add_questions_zh_2,add_questions_en_3,add_questions_zh_hant_3,add_questions_zh_3,add_questions_en_4,add_questions_zh_hant_4,add_questions_zh_4,add_questions_en_5,add_questions_zh_hant_5,add_questions_zh_5) VALUES ('Form Title 1','報名表標題(繁)1','報名表標題(簡)1','Form Content 1','報名表內容(繁)1','報名表內容(簡)1','20240801','20240812','Y','20240810','23','17','Additional Question if any 1?','附加問題如有(繁)1?','附加問題如有(簡)1?','Additional Question if any 2?','附加問題如有(繁)2?','附加問題如有(簡)2?','Additional Question if any 3?','附加問題如有(繁)3?','附加問題如有(簡)3?','Additional Question if any 4?','附加問題如有(繁)4?','附加問題如有(簡)4?','Additional Question if any 5?','附加問題如有(繁)5?','附加問題如有(簡)5?');
INSERT INTO dim_form (title_en,title_zh_hant,title_zh,desc_en,desc_zh_hant,desc_zh,start_date,end_date,is_kid_form,early_bird_end_date,early_bird_discount,ig_discount,add_questions_en_1,add_questions_zh_hant_1,add_questions_zh_1,add_questions_en_2,add_questions_zh_hant_2,add_questions_zh_2,add_questions_en_3,add_questions_zh_hant_3,add_questions_zh_3,add_questions_en_4,add_questions_zh_hant_4,add_questions_zh_4,add_questions_en_5,add_questions_zh_hant_5,add_questions_zh_5) VALUES ('Form Title 2','報名表標題(繁)2','報名表標題(簡)2','Form Content 2','報名表內容(繁)2','報名表內容(簡)2','20240801','20240812','N','20240810','23','17','Additional Question if any 1?','附加問題如有(繁)1?','附加問題如有(簡)1?','Additional Question if any 2?','附加問題如有(繁)2?','附加問題如有(簡)2?','Additional Question if any 3?','附加問題如有(繁)3?','附加問題如有(簡)3?','Additional Question if any 4?','附加問題如有(繁)4?','附加問題如有(簡)4?','Additional Question if any 5?','附加問題如有(繁)5?','附加問題如有(簡)5?');

--Test cases created for dim_form_course table
INSERT INTO dim_form_course (form_id, course_id) VALUES (1, 1);
INSERT INTO dim_form_course (form_id, course_id) VALUES (2, 2);

--Test cases created for fct_application table
INSERT INTO fct_application (student_id,form_id,lang,special,parent_name,parent_relation,emergency_name,emergency_relation,emergency_phone_no,self_leave_name,self_leave_phone_no,residency_status,residency_origin,residency_stay,ig_username,add_answers_1,add_answers_2,add_answers_3,add_answers_4,add_answers_5,consent_name,consent_phone_no,remark,submit_time,early_bird_discount,ig_discount,deduct_credit,price) VALUES (6,1,'en','special need','Parent name','Baba','Emergency name','Mama',4371234560,'Self leave name',4371234561,null,null,null,null,'Q1 answer','Q2 answer','Q3 answer','Q4 answer','Q5 answer','I am consent name',4371234560,'Here is the remark','20240811 10:30:00 AM','N','N',0,100);
INSERT INTO fct_application (student_id,form_id,lang,special,parent_name,parent_relation,emergency_name,emergency_relation,emergency_phone_no,self_leave_name,self_leave_phone_no,residency_status,residency_origin,residency_stay,ig_username,add_answers_1,add_answers_2,add_answers_3,add_answers_4,add_answers_5,consent_name,consent_phone_no,remark,submit_time,early_bird_discount,ig_discount,deduct_credit,price) VALUES (1,2,'en',null,null,null,'Emergency name','Friend',4371234560,null,null,'OWP','HK',365,'ig_hahaha','Q1 answer','Q2 answer','Q3 answer','Q4 answer','Q5 answer','I am consent name',4371234560,'Here is the remark','20240802 10:30:00 AM','Y','Y',0,23);

--Test cases created for dim_application_course
INSERT INTO dim_application_course (application_id, course_id) VALUES (1, 1);
INSERT INTO dim_application_course (application_id, course_id) VALUES (2, 2);