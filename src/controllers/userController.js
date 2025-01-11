import User from "../models/User.js";

export const getAll = async (req, res) => {
  const datas = await User.find();
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
  const datas = await User.findById(req.params.id);
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
  const datas = await User.findByIdAndDelete(req.params.id);
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
