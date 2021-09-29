DROP DATABASE IF EXISTS vacc;

CREATE DATABASE vacc;


-- MYSQL
DROP USER IF EXISTS 'admin'@'%';


CREATE USER IF NOT EXISTS 'admin'@'%' -- % = godtycklig host.
IDENTIFIED
WITH mysql_native_password -- Only MySQL > 8.0.4 bakåtkompatibelt.
BY 'pass'
;

-- Ge användaren alla rättigheter på alla databaser.
GRANT ALL PRIVILEGES
    ON vacc.*
    TO 'admin'@'%'
;

SOURCE sql/vacc/ddl.sql;
-- SHOW GRANTS FOR 'user'@'%';
