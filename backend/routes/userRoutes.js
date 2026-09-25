import express from "express";
const router = express.Router();

import userController from "../controller/userController.js";
import authMid from "../middleware/authMiddleware.js";

// Get User - GET
router.post("/login", userController.getUserEmailAndPasword);
router.get(
  "/users/myprofile",
  authMid.authMiddleware,
  userController.getCurrentUser,
);
// Get Users - GET
router.post("/users", userController.createUser);
router.delete("/users/:id", userController.deleteUser);

export default router;
