-- use database
USE vacc;

-- Drop tables
select "dropping tables" as "";
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS patients;

-- Table creation
select "table creating" as "";
CREATE TABLE users (
    user_id INT AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(30),
    lastname VARCHAR(30),
    role VARCHAR(12),
    username VARCHAR(20),
    password VARCHAR(256),
    salt VARCHAR(16),
    personal_number VARCHAR(13),

    PRIMARY KEY (user_id),
    UNIQUE KEY (username),
    UNIQUE KEY (personal_number)
)
ENGINE INNODB
CHARSET utf8
COLLATE utf8_swedish_ci
;

CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(30) NOT NULL,
    lastname VARCHAR(30) NOT NULL,
    personal_number VARCHAR(13) NOT NULL,
    vaccine VARCHAR(20),
    last_vac_date VARCHAR(20),
    total_shots INT DEFAULT 0,
    notes VARCHAR(1024),

    PRIMARY KEY (patient_id),
    UNIQUE KEY (personal_number)
)
ENGINE INNODB
CHARSET utf8
COLLATE utf8_swedish_ci
;


--
-- Procedures
--
select "Procedures" as "";

--
-- Create procedure for select * from users
--
select "-- Create procedure for select * from users" as "";
DROP PROCEDURE IF EXISTS show_users;
DELIMITER ;;
CREATE PROCEDURE show_users()
BEGIN
    SELECT
    user_id,
    CONCAT(firstname, " ", lastname) AS "name",
    role,
    username
    FROM users;
END
;;
DELIMITER ;


--
-- Create procedure to show all patients
--
DROP PROCEDURE IF EXISTS show_patients;
DELIMITER ;;
CREATE PROCEDURE show_patients()
BEGIN
    SELECT
    patient_id,
    CONCAT(firstname, " ", lastname) AS "name",
    personal_number,
    vaccine,
    last_vac_date,
    total_shots,
    notes
    FROM patients;
END
;;
DELIMITER ;

--
-- Create procedure to get all usernames
--
DROP PROCEDURE IF EXISTS get_usernames;
DELIMITER ;;
CREATE PROCEDURE get_usernames()
BEGIN
    SELECT
    username
    FROM users;
END
;;
DELIMITER ;

--
-- Create procedure to get all personal numbers
--
DROP PROCEDURE IF EXISTS get_personal_numbers;
DELIMITER ;;
CREATE PROCEDURE get_personal_numbers()
BEGIN
    SELECT
    personal_number
    FROM patients;
END
;;
DELIMITER ;

--
-- Create procedure to show searched patients by id
--
DROP PROCEDURE IF EXISTS show_patients_from_id;
DELIMITER ;;
CREATE PROCEDURE show_patients_from_id(
    a_patient_id INT
)
BEGIN
    SELECT
    patient_id,
    CONCAT(firstname, " ", lastname) AS "name",
    personal_number,
    vaccine,
    last_vac_date,
    total_shots,
    notes
    FROM patients
    WHERE patient_id = a_patient_id
    ;
END
;;
DELIMITER ;

--
-- Create procedure to show searched patients by personal_number
--
DROP PROCEDURE IF EXISTS show_patients_search;
DELIMITER ;;
CREATE PROCEDURE show_patients_search(
    a_personal_number VARCHAR(256)
)
BEGIN
    SELECT
    patient_id,
    CONCAT(firstname, " ", lastname) AS "name",
    personal_number,
    vaccine,
    last_vac_date,
    total_shots,
    notes
    FROM patients
    WHERE personal_number LIKE CONCAT("%", a_personal_number, "%")
    ;
END
;;
DELIMITER ;

--
-- Create procedure to show searched users
--
DROP PROCEDURE IF EXISTS show_users_from_search;
DELIMITER ;;
CREATE PROCEDURE show_users_from_search(
    a_search VARCHAR(256)
)
BEGIN
    SELECT
    user_id,
    CONCAT(firstname, " ", lastname) AS "name",
    role,
    username
    FROM users
    WHERE
        user_id LIKE a_search
        OR firstname LIKE CONCAT("%", a_search, "%")
        OR lastname LIKE CONCAT("%", a_search, "%")
        OR role LIKE CONCAT("%", a_search, "%")
        OR username LIKE CONCAT("%", a_search, "%")
    ;
END
;;
DELIMITER ;

--
-- Create procedure to show searched users by id
--
DROP PROCEDURE IF EXISTS show_users_from_id;
DELIMITER ;;
CREATE PROCEDURE show_users_from_id(
    a_user_id INT
)
BEGIN
    SELECT
    user_id,
    CONCAT(firstname, " ", lastname) AS "name",
    role,
    username
    FROM users
    WHERE user_id = a_user_id
    ;
END
;;
DELIMITER ;

--
-- Create procedure to delete users by id
--
DROP PROCEDURE IF EXISTS delete_users_id;
DELIMITER ;;
CREATE PROCEDURE delete_users_id(
    a_user_id INT
)
BEGIN
    DELETE
    FROM users
    WHERE user_id = a_user_id
    ;
END
;;
DELIMITER ;

--
-- Create procedure to delete patients by id
--
DROP PROCEDURE IF EXISTS delete_patients_id;
DELIMITER ;;
CREATE PROCEDURE delete_patients_id(
    a_patient_id INT
)
BEGIN
    DELETE
    FROM patients
    WHERE patient_id = a_patient_id
    ;
END
;;
DELIMITER ;

--
-- Create procedure for users updating their own passwords.
--
DROP PROCEDURE IF EXISTS change_own_pass;
DELIMITER ;;
CREATE PROCEDURE change_own_pass(
    a_user_id INT,
    a_old_pass VARCHAR(64),
    a_new_pass VARCHAR(64)
)
BEGIN
    UPDATE users
    SET
    password = IF(password = SHA2(CONCAT(a_old_pass,salt), 256),
        SHA2(CONCAT(a_new_pass,salt), 256), password)
    WHERE
    user_id = a_user_id
    ;
END
;;
DELIMITER ;

--
-- Create procedure for admin updating users passwords.
--
DROP PROCEDURE IF EXISTS admin_change_pass;
DELIMITER ;;
CREATE PROCEDURE admin_change_pass(
    a_user_id INT,
    a_password VARCHAR(64),
    cookie_id VARCHAR(64)
)
BEGIN
    DECLARE user_role VARCHAR(5);
    SET user_role =
    (select role
        from users
        where SHA2(CONCAT(username,salt),256) = cookie_id);

    UPDATE users
    SET
    password = IF(user_role = "admin", SHA2(CONCAT(a_password,salt), 256), password)
    WHERE
    user_id = a_user_id
    ;
END
;;
DELIMITER ;

--
-- Create procedure for updating patient data.
--
DROP PROCEDURE IF EXISTS update_patient;
DELIMITER ;;
CREATE PROCEDURE update_patient(
    a_patient_id INT,
    a_notes VARCHAR(1024),
    cookie_id VARCHAR(256)
)
BEGIN
    DECLARE user_role VARCHAR(5);
    SET user_role =
    (select role
        from users
        where SHA2(CONCAT(username,salt),256) = cookie_id);

    UPDATE patients
    SET
    notes = IF(user_role = "staff", a_notes, notes),
    last_vac_date = IF(user_role = "staff", NOW(), last_vac_date),
    total_shots = IF(user_role = "staff", total_shots+1, total_shots)
    WHERE
        patient_id = a_patient_id
    ;
END
;;
DELIMITER ;

--
-- Procedure for creating patients
--
DROP PROCEDURE IF EXISTS create_patient;
DELIMITER ;;
CREATE PROCEDURE create_patient(
    a_firstname VARCHAR(30),
    a_lastname VARCHAR(30),
    a_personal_number VARCHAR(13),
    a_vaccine VARCHAR(20),
    a_notes VARCHAR(1024)
)
BEGIN
    INSERT INTO patients
    (firstname, lastname, personal_number, vaccine, last_vac_date, total_shots, notes)
    VALUES
    (a_firstname, a_lastname, a_personal_number, a_vaccine, NOW(), "1", a_notes);
END
;;
DELIMITER ;

--
-- Procedure for creating PATIENT user accounts
--
select "-- Create procedure for select * from users" as "";
DROP PROCEDURE IF EXISTS create_patient_user;
DELIMITER ;;
CREATE PROCEDURE create_patient_user(
    a_firstname VARCHAR(30),
    a_lastname VARCHAR(30),
    a_role VARCHAR(12),
    a_username VARCHAR(20),
    a_password VARCHAR(30),
    a_personal_number VARCHAR(13)
)
BEGIN
    DECLARE r_salt VARCHAR(16);
    SET r_salt = substring(MD5(RAND()),1,16);
    INSERT INTO users (firstname, lastname, role, username, password, salt, personal_number)
    VALUES (a_firstname, a_lastname, a_role, a_username, SHA2(CONCAT(a_password,r_salt), 256), r_salt, a_personal_number);
END
;;
DELIMITER ;

--
-- Procedure for creating REGULAR user accounts
--
DROP PROCEDURE IF EXISTS create_user;
DELIMITER ;;
CREATE PROCEDURE create_user(
    a_firstname VARCHAR(30),
    a_lastname VARCHAR(30),
    a_role VARCHAR(12),
    a_username VARCHAR(20),
    a_password VARCHAR(30)
)
BEGIN
    DECLARE r_salt VARCHAR(16);
    SET r_salt = substring(MD5(RAND()),1,16);
    INSERT INTO users (firstname, lastname, role, username, password, salt)
        VALUES (a_firstname, a_lastname, a_role, a_username, SHA2(CONCAT(a_password,r_salt), 256), r_salt);
END
;;
DELIMITER ;

--
-- Create procedure for getting patient user personal_number from cookie_id
--
DROP PROCEDURE IF EXISTS get_user_personal_number;
DELIMITER ;;
CREATE PROCEDURE get_user_personal_number(
    a_user VARCHAR(256)
)
BEGIN
    SELECT
        personal_number
    FROM users WHERE a_user = SHA2(CONCAT(username,salt),256);
END
;;
DELIMITER ;


--
-- Create procedure for getting patient user acc, patient info
--
select "Create procedure for getting patient user acc, patient info" as "";
DROP PROCEDURE IF EXISTS get_patient_info;
DELIMITER ;;
CREATE PROCEDURE get_patient_info(
    a_personal_number VARCHAR(20)
)
BEGIN
    SELECT
    patient_id,
    CONCAT(firstname, " ", lastname) AS "name",
    personal_number,
    vaccine,
    last_vac_date,
    total_shots,
    notes
    FROM patients
    WHERE personal_number = a_personal_number
    ;
END
;;
DELIMITER ;

--
-- Procedure for creating ADMIN user accounts
--
select "Procedure for creating ADMIN user accounts" as "";
DROP PROCEDURE IF EXISTS create_admin;
DELIMITER ;;
CREATE PROCEDURE create_admin(
    a_firstname VARCHAR(30),
    a_lastname VARCHAR(30),
    a_username VARCHAR(20),
    a_password VARCHAR(30)
)
BEGIN
    DECLARE r_salt VARCHAR(16);
    SET r_salt = substring(MD5(RAND()),1,16);
    INSERT INTO users (firstname, lastname, role, username, password, salt)
        VALUES (a_firstname, a_lastname, 'admin', a_username, SHA2(CONCAT(a_password,r_salt), 256), r_salt);
END
;;
DELIMITER ;

--
-- return username encrypted with salt if login is correct
--
select "return username encrypted with salt if login is correct" as "";
DROP PROCEDURE IF EXISTS user_login;
DELIMITER ;;
CREATE PROCEDURE user_login(
    a_username VARCHAR(20),
    a_password VARCHAR(30)
)
BEGIN
    SELECT
        SHA2(CONCAT(username,salt),256) AS "userid", "success"
    FROM users WHERE password = SHA2(CONCAT(a_password,salt),256) AND username = a_username;
END
;;
DELIMITER ;


-- FOR TESTING
-- return role of user from username
--
select "-- Create procedure for select * from users" as "";
DROP PROCEDURE IF EXISTS get_user_role_test;
DELIMITER ;;
CREATE PROCEDURE get_user_role_test(
    a_user VARCHAR(256)
)
BEGIN
    SELECT
        role, CONCAT(firstname," ",lastname) AS name
    FROM users WHERE a_user = username;
END
;;
DELIMITER ;

--
-- return ID and Role of user from encrypted username
--
DROP PROCEDURE IF EXISTS get_user_id;
DELIMITER ;;
CREATE PROCEDURE get_user_id(
    a_user VARCHAR(256)
)
BEGIN
    SELECT
        user_id, role
    FROM users WHERE a_user = SHA2(CONCAT(username,salt),256);
END
;;
DELIMITER ;

--
-- return role of user from encrypted username
--
DROP PROCEDURE IF EXISTS get_user_role;
DELIMITER ;;
CREATE PROCEDURE get_user_role(
    a_user VARCHAR(256)
)
BEGIN
    SELECT
        role, CONCAT(firstname," ",lastname) AS name
    FROM users WHERE a_user = SHA2(CONCAT(username,salt),256);
END
;;
DELIMITER ;

--
-- return user if login is correct
--
DROP PROCEDURE IF EXISTS check_user;
DELIMITER ;;
CREATE PROCEDURE check_user(
    a_username VARCHAR(20),
    a_password VARCHAR(30)
)
BEGIN
    SELECT
        *
    FROM users WHERE password = SHA2(CONCAT(a_password,salt),256) AND username = a_username;
END
;;
DELIMITER ;


--
-- add users
--
call create_user('Noah','Håkansson','staff','flex','pass');
call create_admin('Admin','Adminsson','admin','pass');
call create_patient('Jon','Doe','18860522-1414','pfizer','here are some notes.');
call create_patient('Alan','Smith','18530212-1515','moderna','');
call create_patient('Håkan','Jönsson','18860920-1616','Astra zeneca','');
call create_patient('Sven','Svensson','15560318-1717','pfizer','here are some notes.');
call create_patient('Anders','Andersson','16920115-1818','moderna','');

