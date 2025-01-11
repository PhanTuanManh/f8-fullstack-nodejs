import { Router } from "express";
import productRoutes from "./productRoutes.js";
import { authRoutes } from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import userRoutes from "./userRoutes.js";

const routes = Router();

routes.use("/products", productRoutes);
routes.use("/auth", authRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/admin/users", userRoutes);

export default routes;
