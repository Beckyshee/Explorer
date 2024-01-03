import { Router } from "express";
import { registerUser, loginUser, getAllUsers, checkUserDetails, getSingleUser, softDeleteUser } from "../controllers/userController";
import { verifyToken } from "../middleware/verifyToken";



const user_router = Router();

// user_router.get('/',verifyToken,getAllUsers)
user_router.post("/register", registerUser);
user_router.post("/login", loginUser);
user_router.get("/fetchSingleUser/:id", getSingleUser);
user_router.get("/fetchAllUsers", getAllUsers);
user_router.put("/soft-delete/:userID", softDeleteUser);
user_router.get("/check_user_details", verifyToken, checkUserDetails);

export default user_router;
