IF DB_ID('cics_database') IS NULL
    CREATE DATABASE cics_database;
GO
USE cics_database;
-- student_id with composite key of CONCAT(phone_no,' ',first_name)
CREATE TABLE dim_student (
	student_id int IDENTITY(1,1) PRIMARY KEY
	,first_name nvarchar(50) NOT NULL
	,last_name nvarchar(50) NOT NULL
	,gender nvarchar(50) NOT NULL
	,dob date
	,address nvarchar(100)
	,city nvarchar(50)
	,postal_code char(7)
	,phone_no bigint
	,email varchar(100)
	,credit_balance decimal(38,6) DEFAULT 0
	);
-- depends if CICS have course code as id
CREATE TABLE dim_course (
    course_id int IDENTITY(1,1) PRIMARY KEY
    ,course_name nvarchar(255)
    ,course_period nvarchar(50)
    ,tutor_name nvarchar(50)
    ,course_start_date date
    ,course_end_date date
    ,course_time_slot nvarchar(50)
    ,total_no_of_lesson int
    ,price decimal(38,6)
    ,capacity int
    ,eb_discount_ind char(1)
    ,eb_discount_pct decimal(38,6)
    );
	
--Test cases created for dim_student table
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST1', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000001, 'test1@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST2', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000002, 'test2@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST3', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000003, 'test3@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST4', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000004, 'test4@test.com');
INSERT INTO dim_student (first_name, last_name, gender, dob, address, city, postal_code, phone_no, email) VALUES ('FIRST5', 'LAST', 'M','19990131','Address', 'city', 'M2J 0G4', 4370000005, 'test5@test.com');

