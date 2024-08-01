IF DB_ID('cics_database') IS NULL
    CREATE DATABASE cics_database;
GO
USE cics_database;
-- customer_id with composite key of CONCAT(phone_no,' ',first_name)
CREATE TABLE dim_customer (
    customer_id nvarchar(100) PRIMARY KEY
    ,first_name nvarchar(50) NOT NULL
    ,last_name nvarchar(50) NOT NULL
    ,gender nvarchar(50) NOT NULL
    ,dob date
    ,address nvarchar(100)
    ,city nvarchar(50)
    ,postal_code char(6)
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
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Anson', 'Ng', 'M');
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Stephanie', 'Yip' ,'F');
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Timothy', 'Wong', 'M');
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Whitney', 'Yuen', 'F');
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Winnie', 'Choi', 'F');
