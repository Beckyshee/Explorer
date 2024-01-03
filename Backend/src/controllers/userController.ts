import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import mssql from "mssql";
import { sqlConfig } from "../configs/sqlConfig";
import { userLoginValidationSchema } from "../validators/userValidators";
import jwt from 'jsonwebtoken'
import { ExtendedUser } from "../middleware/verifyToken";


//Register user
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
   
    const { fullName, email, phone, password } = req.body;
    const userID = uuidv4();
    const hashedPwd = await bcrypt.hash(password, 10); 


    const pool = await mssql.connect(sqlConfig);

    
    const data = await pool
      .request()
      .input("userID", mssql.VarChar, userID)
      .input("fullName", mssql.VarChar, fullName)
      .input("email", mssql.VarChar, email)
      .input("phone", mssql.VarChar, phone)
      .input("password", mssql.VarChar, hashedPwd)
      .execute("registerUser");

    console.log(data);

    res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const { error } = userLoginValidationSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const pool = await mssql.connect(sqlConfig);

    let user = await (
      await pool
        .request()
        .input("email", mssql.VarChar, email)
        .input("password", mssql.VarChar, password)
        .execute("loginUser")
    ).recordset;
    console.log(user);

    if (user.length === 1) {
      const correctPwd = await bcrypt.compare(password, user[0].Password);

      if (!correctPwd) {
        return res.status(401).json({
          error: "Incorrect password",
        });
      }
      const loginCredentials = user.map((record) => {
        const { password, ...rest } = record;
        return rest;
      });

      const token = jwt.sign(
        loginCredentials[0],
        process.env.SECRET as string,
        {
          expiresIn: "3600s",
        }
      );

      return res.status(200).json({
        message: "Logged in successfully",
        token,
        UserID: user[0].UserID,
      });
    } else {
      return res.status(401).json({
        error: "Email not found",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};


//get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const pool = await mssql.connect(sqlConfig);

    let users = (await pool.request().execute("fetchAllUsers"))
      .recordset;
    // let users = (await pool.request().query('SELECT * FROM Users')).recordset

    return res.status(200).json({
      users: users,
    });
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};

//getting a single user
export const getSingleUser = async (req: Request, res: Response) => {
  try {
    let id = req.params.id;

    const pool = await mssql.connect(sqlConfig);

    let user = (
      await pool.request().input("UserID", id).execute("fetchSingleUser")
    ).recordset;
    // let users = (await pool.request().query('SELECT * FROM Users')).recordset

    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    return res.json({
      error: error,
    });
  }
};


//checkUser Details
export const checkUserDetails = async (req: ExtendedUser, res: Response) => {
  if (req.info) {
    return res.json({
      info: req.info,
    });
  }
};


//soft delete
export const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
console.log(req.params);
 const pool = await mssql.connect(sqlConfig);
    // Check if the user exists
    const userExists = await pool
      .request()
      .input("UserID", userID)
      .execute("checkUserExists");
// console.log(userExists);

    if (userExists.recordset.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Perform soft delete by updating the isDeleted field
    const result = await pool
      .request()
      .input("UserID", userID)
      .execute("softDeleteUser"); // Replace with your actual stored procedure for soft delete

    console.log(result);

    return res.status(200).json({
      message: "Soft Delete Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error,
    });
  }
};