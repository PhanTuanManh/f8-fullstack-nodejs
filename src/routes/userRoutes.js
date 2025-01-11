import { Router } from "express";
import { getAll, getById, removeById } from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.get("/", getAll);
userRoutes.get("/:id", getById);
userRoutes.delete("/:id", removeById);

export default userRoutes;
