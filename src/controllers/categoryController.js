import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();

export const getAll = async (req, res) => {
  const datas = await Category.find();
  if (!datas || datas.length === 0) {
    return res.status(404).send({
      message: "Not found!",
    });
  }
  return res.status(200).send({
    message: "Get successfully!",
    datas,
  });
};

export const create = async (req, res) => {
  const datas = await Category.create(req.body);
  if (!datas) {
    return res.status(404).send({
      message: "Not found!",
    });
  }
  return res.status(200).send({
    message: "Create successfully!",
    datas,
  });
};

export const getById = async (req, res) => {
  const datas = await Category.findById(req.params.id).populate("products");
  console.log(datas);
  if (!datas) {
    return res.status(404).send({
      message: "Not found!",
    });
  }
  return res.status(200).send({
    message: "Get successfully!",
    datas,
  });
};

export const removeById = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).send({
        message: "Category not found!",
      });
    }

    if (category._id.toString() === process.env.DEFAULT_CATEGORY_ID) {
      return res.status(400).send({
        message: "Cannot delete default category!",
      });
    }

    const productsToUpdate = await Product.find({ categoryId: category._id });
    console.log(productsToUpdate);

    await Product.updateMany(
      { categoryId: category._id },
      {
        $set: {
          categoryId: new mongoose.Types.ObjectId(
            process.env.DEFAULT_CATEGORY_ID
          ),
        },
      }
    );

    await Category.updateOne(
      { _id: new mongoose.Types.ObjectId(process.env.DEFAULT_CATEGORY_ID) },
      { $push: { products: { $each: productsToUpdate.map((p) => p._id) } } }
    );

    return res.status(200).send({
      message: "Delete successfully!",
      deletedCategory: category,
      updatedProductsCount: productsToUpdate.length,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).send({
      message: "An error occurred while deleting category.",
      error: error.message,
    });
  }
};

export const softRemoveById = async (req, res) => {
  try {
    const datas = await Category.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), isHidden: true },
      { new: true, timestamps: true }
    );
    if (!datas) {
      return res.status(404).send({
        message: "Not found!",
      });
    }
    return res.status(200).send({
      message: "Soft delete successfully!",
      datas,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const updateById = async (req, res) => {
  const datas = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    timestamps: true,
  });
  if (!datas) {
    return res.status(404).send({
      message: "Not found!",
    });
  }
  return res.status(200).send({
    message: "Update successfully!",
    datas,
  });
};
