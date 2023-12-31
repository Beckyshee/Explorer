import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import mssql from "mssql";
import { sqlConfig } from "../configs/sqlConfig";

// Assuming you have a validation schema, import it here if you are using one.

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
   
    const { name, email, password } = req.body;
    const userID = uuidv4();
    const hashedPwd = await bcrypt.hash(password, 10); // You can adjust the salt rounds


    const pool = await mssql.connect(sqlConfig);

    
    const data = await pool
      .request()
      .input("userID", mssql.VarChar, userID)
      .input("Name", mssql.VarChar, name)
      .input("Email", mssql.VarChar, email)
      .input("Password", mssql.VarChar, hashedPwd)
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
