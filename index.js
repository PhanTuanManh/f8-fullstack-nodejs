import express from "express";
import routes from "./src/routes/index.js";
import connectDB from "./src/config/db.js";
import dotenv from "dotenv";

dotenv.config();

const { PORT } = process.env;

const app = express();
app.use(express.json());

connectDB();

app.use("/", routes);

// Xử lý not found phải đặt ở sau cùng  các routes
app.use((req, res, next) => {
  res.status(404).send("Not found");
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
