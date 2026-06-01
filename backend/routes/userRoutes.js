import express from "express";
const router = express.Router();

import userController from "../controller/userController.js";

// Get User - GET
router.post("/login", userController.getUserEmailAndPasword);
router.post("/users", userController.createUser);
router.delete("/users/:id", userController.deleteUser);

export default router;
