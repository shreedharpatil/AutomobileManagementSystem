drop database abs;
create database abs;
use abs;


Create table login_info	(								          
user_name varchar(100)  primary key,
password varchar(100),									                    
user_type varchar(20));


Create table dealer_info (									                                 
dealer_id bigint auto_increment primary key,						
dealer_title varchar(10),
dealer_firstname varchar(100),
dealer_lastname varchar(100),
dealer_addres varchar(500),
dealer_place varchar(100),
dealer_tinno varchar(50),
dealer_mobile varchar(15),
dealer_emailid varchar(100),
dealer_imgurl varchar(500),
dealer_reg_date date);



Create table customer_info(
cust_id bigint auto_increment primary key,
cust_title varchar(10),
cust_firstname varchar(100),
cust_lastname varchar(100),
cust_addres varchar(500),
cust_place varchar(100),
cust_vehicleno varchar(50),
cust_vehicletype varchar(20),
cust_mobile varchar(15),
cust_emailid varchar(100),
cust_imgurl varchar(500),
cust_reg_date date,
is_guest_user boolean );


create table stocks(
stock_id bigint  primary key,
stock_name varchar(1000),
status varchar(100));


create table stock_item(
stock_item_id bigint  primary key,
stock_item_name varchar(1000),
quantity varchar(20),
unit_type varchar(20),
stock_id bigint,
unit_price decimal(10,3),
status varchar(100),
  foreign key (stock_id) 
  references stocks(stock_id)
   on delete cascade);
   

Create table Dealer_transaction (
Trans_id bigint auto_increment primary key,
dealer_id bigint,
trans_date date,
invoice_no varchar(500),
invoice_url varchar(500),
total_amount decimal(10,3),
paid_amount decimal(10,3),
due_amount decimal(10,3),
trans_status varchar(20),
stock_item_ids varchar(1000),
stock_item_quantities varchar(1000),
vat decimal(20,3),
discount decimal(20,3),
stock_item_prices varchar(1000),
foreign key (dealer_id)
references dealer_info(dealer_id));


Create table customer_transaction (
Trans_id bigint auto_increment primary key,
cust_id bigint,
trans_date date,
invoice_no varchar(50),
total_amount decimal(10,3),
paid_amount decimal(10,3),
due_amount decimal(10,3),
trans_status varchar(20),
vat decimal(10,3),
discount_rate decimal(10,3),
stock_item_ids varchar(1000),
stock_item_quantities varchar(1000),
stock_item_prices varchar(1000),
invoice_url varchar(500),
foreign key (cust_id)
references customer_info(cust_id),
is_guest_user boolean);


create table daily_sheet(
perticulers varchar(1000),
quantity varchar(100),
bill_no varchar(100),
amount  decimal(20,3),
date_of_expenditure date,
expenditure_type varchar(100)
);

insert into login_info values('admin','admin','admin');

  
create table application_expiry_details
(appilcation_installed_date date ,
application_renewal_date date);

insert into application_expiry_details (appilcation_installed_date,application_renewal_date)
values (CURDATE(),DATE_ADD(CURDATE(), INTERVAL 1 YEAR));

CREATE TABLE sequence (id INT NOT NULL);
INSERT INTO sequence VALUES (0);

CREATE USER 'abs'@'localhost' IDENTIFIED BY 'abs'; GRANT ALL PRIVILEGES ON * . * TO 'abs'@'localhost'; FLUSH PRIVILEGES;
