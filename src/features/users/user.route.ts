import { Router } from "express";
import { createUser, getAllUser } from "./user.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const userRoute = Router();

userRoute.post("/add", createUser);
userRoute.get("/getUser", getAllUser);

export default userRoute;
