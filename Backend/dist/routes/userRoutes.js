"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const verifyToken_1 = require("../middleware/verifyToken");
const user_router = (0, express_1.Router)();
// user_router.get('/',verifyToken,getAllUsers)
user_router.post("/register", userController_1.registerUser);
user_router.post("/login", userController_1.loginUser);
user_router.get("/fetchSingleUser/:id", userController_1.getSingleUser);
user_router.get("/fetchAllUsers", userController_1.getAllUsers);
user_router.put("/soft-delete/:userID", userController_1.softDeleteUser);
user_router.get("/check_user_details", verifyToken_1.verifyToken, userController_1.checkUserDetails);
exports.default = user_router;
