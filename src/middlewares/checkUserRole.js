const userExists = await User.findById(decoded.id);

if (!userExists) {
  return res.status(401).send({ message: "Unauthorized" });
}

if (userExists.role !== "admin") {
  return res.status(401).send({ message: "Unauthorized" });
}
