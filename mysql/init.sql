-- PGS Database Initialization
CREATE DATABASE IF NOT EXISTS pgs_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'pgs_user'@'%' IDENTIFIED BY 'pgs_password';
GRANT ALL PRIVILEGES ON pgs_db.* TO 'pgs_user'@'%';
FLUSH PRIVILEGES;

USE pgs_db;

-- Tables are auto-created by Hibernate (ddl-auto=update)
-- This script handles initial setup only
