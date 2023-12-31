CREATE TABLE Users (
    userID VARCHAR(255) PRIMARY KEY,
    fullName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
     role VARCHAR(20) Default 'user',
    welcomed BIT Default 0,
    isDeleted BIT DEFAULT 0 
);

USE Xplora;

SELECT * FROM Users WHERE EMAIL ='wanjirubecky.rw@gmail.com' 

UPDATE Users SET role = 'admin' WHERE email = 'wanjirubecky.rw@gmail.com'