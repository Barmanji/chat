import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createCallLog,
    getUserCallLogs,
    deleteCallLog,
    clearAllCallLogs
} from "../controllers/callLog.controller.js";

const router = express.Router();

// Protected routes
router.use(verifyJWT);

// Create a call log (audio/video call)
router.route("/").post(createCallLog);

// Get current user's call logs
router.route("/").get(getUserCallLogs);

// Delete a specific call log
router.route("/:callLogId").delete(deleteCallLog);

// Clear all call logs for current user
router.route("/clear/all").delete(clearAllCallLogs);

export default router;

