import Category from "../models/Category.js";

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
  const datas = await Category.findByIdAndDelete(req.params.id);
  if (!datas || datas._id.toString() === process.env.DEFAULT_CATEGORY_ID) {
    return res.status(400).send({
      message: !datas
        ? "Category not found!"
        : "Cannot delete default category!",
    });
  }

  return res.status(200).send({
    message: "Delete successfully!",
    datas,
  });
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
