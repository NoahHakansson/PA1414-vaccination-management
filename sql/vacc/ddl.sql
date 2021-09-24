-- use database
USE vacc;

-- Drop tables
DROP TABLE IF EXISTS users;

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

--
-- return role of user from encrypted username
--
DROP PROCEDURE IF EXISTS get_user_role;
DELIMITER ;;
CREATE PROCEDURE get_user_role(
    a_username VARCHAR(256)
)
BEGIN
    SELECT
        role, CONCAT(firstname," ",lastname) AS name
    FROM users WHERE a_username = SHA2(CONCAT(username,salt),256);
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
