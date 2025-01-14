import { Router } from "express";
import {
  create,
  getAll,
  getById,
  removeById,
  softRemoveById,
  updateById,
} from "../controllers/productControllers.js";
import { checkUserRole } from "../middlewares/checkUserRole.js";
import validBodyRequest from "../middlewares/validBodyRequest.js";
import { verifyUser } from "../middlewares/verifyUser.js";
import productSchema from "../validations/productSchemas.js";

const productRoutes = Router();

productRoutes.get("/", getAll);
productRoutes.get("/:id", getById);
productRoutes.post("/", validBodyRequest(productSchema), create);
productRoutes.patch("/:id", validBodyRequest(productSchema), updateById);
productRoutes.delete("/:id", verifyUser, checkUserRole("admin"), removeById);
productRoutes.patch(
  "/soft-delete/:id",
  verifyUser,
  checkUserRole("admin"),
  softRemoveById
);

export default productRoutes;
