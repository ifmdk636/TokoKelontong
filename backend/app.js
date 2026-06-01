import express from "express";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
const port = 3000;

const app = express();
app.use(express.json());
app.use(cors());

// Routes REST-API
app.post("/login", userRoutes);
app.post("/users", userRoutes);
app.delete("/users/:id", userRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
