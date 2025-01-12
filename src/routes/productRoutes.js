import { Router } from "express";
import {
  create,
  getAll,
  getById,
  removeById,
  softRemoveById,
  updateById,
} from "../controllers/productControllers.js";
import productSchema from "../validations/productSchemas.js";
import validBodyRequest from "../middlewares/validBodyRequest.js";

const productRoutes = Router();

productRoutes.get("/", getAll);
productRoutes.get("/:id", getById);
productRoutes.post("/", validBodyRequest(productSchema), create);
productRoutes.patch("/:id", validBodyRequest(productSchema), updateById);
productRoutes.delete("/:id", removeById);
productRoutes.patch("/soft-delete/:id", softRemoveById);

export default productRoutes;
