import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const create = async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);

    await Category.findByIdAndUpdate(newProduct.categoryId, {
      $push: { products: newProduct._id },
    });

    return res.status(200).send({
      message: "Create successfully!",
      datas: newProduct,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error creating product!",
      error: error.message,
    });
  }
};

export const getAll = async (req, res) => {
  const datas = await Product.find();
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

export const getById = async (req, res) => {
  const datas = await Product.findById(req.params.id);
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
  const datas = await Product.findByIdAndDelete(req.params.id);
  if (!datas) {
    return res.status(404).send({
      message: "Not found!",
    });
  }
  return res.status(200).send({
    message: "Delete successfully!",
    datas,
  });
};

export const softRemoveById = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { deletedAt: new Date(), isHidden: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }

    return res.status(200).send({
      message: "Soft delete successfully!",
      datas: product,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error!",
      error: error.message,
    });
  }
};

export const updateById = async (req, res) => {
  try {
    const productId = req.params.id;
    const { categoryId, ...updateData } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }

    if (categoryId) {
      const newCategory = await Category.findById(categoryId);
      if (!newCategory) {
        return res.status(404).send({
          message: "New category not found!",
        });
      }
      if (product.categoryId.toString() !== categoryId) {
        await Category.findByIdAndUpdate(product.categoryId, {
          $pull: { products: productId },
        });
        await Category.findByIdAndUpdate(categoryId, {
          $push: { products: productId },
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...updateData, categoryId },
      { new: true }
    );

    return res.status(200).send({
      message: "Update successfully!",
      datas: updatedProduct,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal server error!",
      error: error.message,
    });
  }
};
