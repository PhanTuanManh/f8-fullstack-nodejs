const validBodyRequest = (reqBody) => (req, res, next) => {
  try {
    reqBody.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        title: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        message: "Validation Error!",
        errors: formattedErrors,
      });
    }

    return res.status(400).json({
      message: "Error!",
      error: error.message || "Unexpected error",
    });
  }
};

export default validBodyRequest;
