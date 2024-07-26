CREATE DATABASE cics_database;
GO
USE cics_database;
CREATE TABLE dim_customer (customer_id varchar(50) PRIMARY KEY, first_name nvarchar(255) NOT NULL, last_name nvarchar(255) NOT NULL);
INSERT INTO dim_customer VALUES ('0', 'Anson', 'Ng');
INSERT INTO dim_customer VALUES ('1', 'Stephanie', 'Yip');
INSERT INTO dim_customer VALUES ('2', 'Timothy', 'Wong');
INSERT INTO dim_customer VALUES ('3', 'Whitney', 'Yuen');
INSERT INTO dim_customer VALUES ('4', 'Winnie', 'Choi');
