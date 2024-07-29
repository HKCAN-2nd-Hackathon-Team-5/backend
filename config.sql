IF DB_ID('cics_database') IS NULL
    CREATE DATABASE cics_database;
GO
USE cics_database;
CREATE TABLE dim_customer (customer_id INT IDENTITY(1,1) PRIMARY KEY, first_name nvarchar(255) NOT NULL, last_name nvarchar(255) NOT NULL, GENDER nvarchar(255) NOT NULL, DOB date /*NOT NULL*/, ADDRESS nvarchar(100) /*NOT NULL*/, CITY nvarchar(50) /*NOT NULL*/, POSTAL_CODE varchar(7) /*NOT NULL*/, PHONE_NO bigint /*NOT NULL*/, EMAIL varchar(100), CREDIT_BALANCE decimal DEFAULT 0);
INSERT INTO dim_customer (first_name, last_name,GENDER) VALUES ('Anson', 'Ng', 'M');
INSERT INTO dim_customer (first_name, last_name,GENDER) VALUES ('Stephanie', 'Yip' ,'F');
INSERT INTO dim_customer (first_name, last_name,GENDER) VALUES ('Timothy', 'Wong', 'M');
INSERT INTO dim_customer (first_name, last_name,GENDER) VALUES ('Whitney', 'Yuen', 'F');
INSERT INTO dim_customer (first_name, last_name,GENDER) VALUES ('Winnie', 'Choi', 'F');