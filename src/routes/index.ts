import { Router } from "express";
import userRoute from "../features/users/user.route.js";

const route = Router();

route.use("/users", userRoute);

export default route;
