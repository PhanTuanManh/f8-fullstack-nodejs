import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import validBodyRequest from "../middlewares/validBodyRequest.js";
import authSchema from "../validations/authSchemas.js";

export const authRoutes = Router();

authRoutes.post("/register", validBodyRequest(authSchema.register), register);
authRoutes.post("/login", validBodyRequest(authSchema.login), login);
