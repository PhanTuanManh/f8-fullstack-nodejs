import { Router } from "express";
import {
  create,
  getAll,
  getById,
  removeById,
  softRemoveById,
  updateById,
} from "../controllers/categoryController.js";
import categorySchema from "../validations/categorySchemas.js";
import validBodyRequest from "../middlewares/validBodyRequest.js";

const categoryRoutes = Router();

categoryRoutes.get("/", getAll);
categoryRoutes.post("/", validBodyRequest(categorySchema), create);
categoryRoutes.get("/:id", getById);
categoryRoutes.delete("/:id", removeById);
categoryRoutes.patch("/:id", validBodyRequest(categorySchema), updateById);
categoryRoutes.patch("/soft-delete/:id", softRemoveById);

export default categoryRoutes;
