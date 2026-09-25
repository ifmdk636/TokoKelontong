import express from "express";
import cartController from "../controller/cartController.js";
import authMid from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMid.authMiddleware);
router.get("/", cartController.getCart);
router.post("/cart", cartController.addItem);
router.patch("/:id", cartController.updateItem);
router.delete("/:id", cartController.removeItem);

export default router;
