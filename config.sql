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
	,postal_code	char(7)
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
	,early_bird_end_date 	date
	,early_bird_discount 	decimal(38,6)
	,ig_discount         	int
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
	

	
--Test cases created for dim_student table
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST1', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000001, 'test1@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST2', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000002, 'test2@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST3', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000003, 'test3@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST4', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000004, 'test4@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST5', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000005, 'test5@test.com');

--Test cases created for dim_course table
INSERT INTO dim_course (course_name_en,course_name_zh_hant,course_name_zh,tutor_name,venue,start_date,end_date,start_time,end_time,capacity,price,early_bird_end_date,early_bird_discount,ig_discount,age_min,age_max,min_attendance) VALUES ('COURSE1','課程(繁)1','課程(簡)1','tutor1','CICS room 1','20240812','20240823','10:30:00','12:30:00',10,100,'20240810',28,9,6,18,2);
INSERT INTO dim_course (course_name_en,course_name_zh_hant,course_name_zh,tutor_name,venue,start_date,end_date,start_time,end_time,capacity,price,early_bird_end_date,early_bird_discount,ig_discount,age_min,age_max,min_attendance) VALUES ('COURSE2','課程(繁)2','課程(簡)2','tutor2','CICS room 2','20240812','20240816','10:30:00','12:30:00',20,50,'20240810',8,19,18,null,1);

--Test case created for dim_course_weekday table
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (1, 1);
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (1, 3);
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (1, 5);
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (2, 2);
INSERT INTO dim_course_weekday (course_id, weekday) VALUES (2, 4);

--Test case created for dim_course_except_date table (if having any)
INSERT INTO dim_course_except_date (course_id, except_date) VALUES (1, '20240814');
