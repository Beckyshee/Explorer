"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteUser = exports.checkUserDetails = exports.getSingleUser = exports.getAllUsers = exports.loginUser = exports.registerUser = void 0;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mssql_1 = __importDefault(require("mssql"));
const sqlConfig_1 = require("../configs/sqlConfig");
const userValidators_1 = require("../validators/userValidators");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Register user
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullName, email, phone, password } = req.body;
        const userID = (0, uuid_1.v4)();
        const hashedPwd = yield bcrypt_1.default.hash(password, 10);
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        const data = yield pool
            .request()
            .input("userID", mssql_1.default.VarChar, userID)
            .input("fullName", mssql_1.default.VarChar, fullName)
            .input("email", mssql_1.default.VarChar, email)
            .input("phone", mssql_1.default.VarChar, phone)
            .input("password", mssql_1.default.VarChar, hashedPwd)
            .execute("registerUser");
        console.log(data);
        res.status(200).json({
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { error } = userValidators_1.userLoginValidationSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let user = yield (yield pool
            .request()
            .input("email", mssql_1.default.VarChar, email)
            .input("password", mssql_1.default.VarChar, password)
            .execute("loginUser")).recordset;
        console.log(user);
        if (user.length === 1) {
            const correctPwd = yield bcrypt_1.default.compare(password, user[0].Password);
            if (!correctPwd) {
                return res.status(401).json({
                    error: "Incorrect password",
                });
            }
            const loginCredentials = user.map((record) => {
                const { password } = record, rest = __rest(record, ["password"]);
                return rest;
            });
            const token = jsonwebtoken_1.default.sign(loginCredentials[0], process.env.SECRET, {
                expiresIn: "3600s",
            });
            return res.status(200).json({
                message: "Logged in successfully",
                token,
                UserID: user[0].UserID,
            });
        }
        else {
            return res.status(401).json({
                error: "Email not found",
            });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error",
        });
    }
});
exports.loginUser = loginUser;
//get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let users = (yield pool.request().execute("fetchAllUsers"))
            .recordset;
        // let users = (await pool.request().query('SELECT * FROM Users')).recordset
        return res.status(200).json({
            users: users,
        });
    }
    catch (error) {
        return res.json({
            error: error,
        });
    }
});
exports.getAllUsers = getAllUsers;
//getting a single user
const getSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.params.id;
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        let user = (yield pool.request().input("UserID", id).execute("fetchSingleUser")).recordset;
        // let users = (await pool.request().query('SELECT * FROM Users')).recordset
        return res.status(200).json({
            user: user,
        });
    }
    catch (error) {
        return res.json({
            error: error,
        });
    }
});
exports.getSingleUser = getSingleUser;
//checkUser Details
const checkUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.info) {
        return res.json({
            info: req.info,
        });
    }
});
exports.checkUserDetails = checkUserDetails;
//soft delete
const softDeleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        console.log(req.params);
        const pool = yield mssql_1.default.connect(sqlConfig_1.sqlConfig);
        // Check if the user exists
        const userExists = yield pool
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
        const result = yield pool
            .request()
            .input("UserID", userID)
            .execute("softDeleteUser"); // Replace with your actual stored procedure for soft delete
        console.log(result);
        return res.status(200).json({
            message: "Soft Delete Successful",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            error: error,
        });
    }
});
exports.softDeleteUser = softDeleteUser;
