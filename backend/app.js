import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import db from "./connection/connection.js";

const port = Number(process.env.PORT || 3000);

const app = express();
app.use(express.json());
app.use(cors());

// Routes REST-API
app.use("/", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/admin/dashboard", dashboardRoutes);

if (!db) {
  console.error("Backend tidak dapat dimulai karena koneksi MySQL gagal.");
  process.exitCode = 1;
} else {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
