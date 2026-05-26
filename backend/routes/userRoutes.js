import express from "express";
const router = express.Router();

import userController from "../controller/userController.js";

// Get User - GET
router.get("/users", userController.getAllUser);
router.post("/users", userController.createUser);
router.delete("/users/:id", userController.deleteUser);

export default router;
