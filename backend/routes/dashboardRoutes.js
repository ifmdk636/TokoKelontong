import express from "express";
import authMid from "../middleware/authMiddleware.js";
import dashboardController from "../controller/dashboardController.js";

const router = express.Router();
router.use(authMid.authMiddleware);
router.get("/summary", dashboardController.getSummary);
router.get("/sales-overview", dashboardController.getSalesOverview);
router.get("/top-products", dashboardController.getTopProducts);
router.get("/orders/:orderId/items", dashboardController.getOrderItems);
router.get("/order-items", dashboardController.getOrderItems);

export default router;