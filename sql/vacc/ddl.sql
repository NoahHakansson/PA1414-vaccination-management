-- use database
USE vacc;

-- Drop tables
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS patients;

-- Table creation
CREATE TABLE users (
    user_id INT AUTO_INCREMENT NOT NULL,
    firstname VARCHAR(30),
    lastname VARCHAR(30),
    role VARCHAR(5),
    username VARCHAR(20),
    password VARCHAR(256),
    salt VARCHAR(16),

    PRIMARY KEY (user_id),
    UNIQUE KEY (username)
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

--
-- Create procedure for select * from users
--
DROP PROCEDURE IF EXISTS show_users;
DELIMITER ;;
CREATE PROCEDURE show_users()
BEGIN
    SELECT * FROM users;
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
    DECLARE user_coookie_id VARCHAR(256);
    SET user_coookie_id =
    (select SHA2(CONCAT(username,salt),256)
        from users
        where SHA2(CONCAT(username,salt),256) = cookie_id);

    UPDATE patients
    SET
    notes = IF(cookie_id = user_coookie_id, a_notes, notes),
    last_vac_date = IF(cookie_id = user_coookie_id, NOW(), last_vac_date),
    total_shots = IF(cookie_id = user_coookie_id, total_shots+1, total_shots)
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
-- Procedure for creating REGULAR user accounts
--
DROP PROCEDURE IF EXISTS create_user;
DELIMITER ;;
CREATE PROCEDURE create_user(
    a_firstname VARCHAR(30),
    a_lastname VARCHAR(30),
    a_username VARCHAR(20),
    a_password VARCHAR(30)
)
BEGIN
    DECLARE r_salt VARCHAR(16);
    SET r_salt = substring(MD5(RAND()),1,16);
    INSERT INTO users (firstname, lastname, role, username, password, salt)
        VALUES (a_firstname, a_lastname, 'staff', a_username, SHA2(CONCAT(a_password,r_salt), 256), r_salt);
END
;;
DELIMITER ;


--
-- Procedure for creating ADMIN user accounts
--
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
call create_user('Noah','Håkansson','flex','pass');
call create_admin('Admin','Adminsson','admin','pass');
call create_patient('Jon','Doe','18860522-1414','pfizer','here are some notes.');
call create_patient('Alan','Smith','18530212-1515','moderna','');
call create_patient('Håkan','Jönsson','18860920-1616','Astra zeneca','');
call create_patient('Sven','Svensson','15560318-1717','pfizer','here are some notes.');
call create_patient('Anders','Andersson','16920115-1818','moderna','');

