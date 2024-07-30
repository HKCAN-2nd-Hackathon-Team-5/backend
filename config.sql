IF DB_ID('cics_database') IS NULL
    CREATE DATABASE cics_database;
GO
USE cics_database;
CREATE TABLE dim_customer (id int IDENTITY(1,1) PRIMARY KEY, first_name nvarchar(255) NOT NULL, last_name nvarchar(255) NOT NULL, gender nvarchar(255) NOT NULL, dob date, address nvarchar(100), city nvarchar(50), postal_code char(6), phone_no bigint, email varchar(100), credit_balance decimal DEFAULT 0);
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Anson', 'Ng', 'M');
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Stephanie', 'Yip' ,'F');
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Timothy', 'Wong', 'M');
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Whitney', 'Yuen', 'F');
INSERT INTO dim_customer (first_name, last_name, gender) VALUES ('Winnie', 'Choi', 'F');
