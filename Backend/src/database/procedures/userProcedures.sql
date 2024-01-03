CREATE PROCEDURE registerUser(
    @userID VARCHAR(255),
    @fullName VARCHAR(255),
    @email VARCHAR(255),
    @phone VARCHAR(15),
    @password VARCHAR(255)
)
AS
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Users WHERE Email = @email)
    BEGIN
        INSERT INTO Users (UserID, fullName, Email, Phone, Password)
        VALUES (@userID, @fullName, @email, @phone, @password)
    END
    ELSE
    BEGIN
        PRINT 'Email already exists. User not registered.'
    END
END

-- USE Xplora;
SELECT * FROM Users


-- CREATE PROCEDURE loginUser(
--     @email VARCHAR(300),
--     @password VARCHAR(200)
-- )
-- AS
-- BEGIN
--     SELECT UserID, fullName, Email, Phone, Password
--     FROM Users
--     WHERE Email = @email 
-- END
