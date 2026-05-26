import express from "express";
import userRoutes from "./routes/userRoutes.js";
const app = express();
const port = 3000;

// Body Parser
app.use(express.json());

// Routes REST-API
app.get("/users", userRoutes);
app.post("/users", userRoutes);
app.delete("/users/:id", userRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
