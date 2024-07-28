CREATE DATABASE cics_database;
GO
USE cics_database;
CREATE TABLE dim_customer (customer_id varchar(50) PRIMARY KEY, first_name nvarchar(255) NOT NULL, last_name nvarchar(255) NOT NULL, GENDER nvarchar(255) NOT NULL, DOB date /*NOT NULL*/, ADDRESS nvarchar(100) /*NOT NULL*/, CITY nvarchar(50) /*NOT NULL*/, POSTAL_CODE varchar(7) /*NOT NULL*/, PHONE_NO bigint /*NOT NULL*/, EMAIL varchar(100), CREDIT_BALANCE decimal DEFAULT 0);
INSERT INTO dim_customer (customer_id, first_name, last_name,GENDER) VALUES ('1', 'Anson', 'Ng', 'M');
INSERT INTO dim_customer (customer_id, first_name, last_name,GENDER) VALUES ('2', 'Stephanie', 'Yip' ,'F');
INSERT INTO dim_customer (customer_id, first_name, last_name,GENDER) VALUES ('3', 'Timothy', 'Wong', 'M');
INSERT INTO dim_customer (customer_id, first_name, last_name,GENDER) VALUES ('4', 'Whitney', 'Yuen', 'F');
INSERT INTO dim_customer (customer_id, first_name, last_name,GENDER) VALUES ('5', 'Winnie', 'Choi', 'F');