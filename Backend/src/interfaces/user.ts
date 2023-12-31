import { Request } from "express";

export interface User {
    userID: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
}

export interface LoginUser extends Request {
  email: string;
  password: string;
}
