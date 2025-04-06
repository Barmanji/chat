import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
    markAllNotificationsAsRead,
    clearAllNotifications
} from "../controllers/notification.controller.js";

const router = express.Router();

// Protected routes
router.use(verifyJWT);

// Create a notification (used internally when needed)
router.route("/").post(createNotification);

// Get all notifications for the current user
router.route("/").get(getUserNotifications);

// Mark a specific notification as read
router.route("/:id/read").patch(markNotificationAsRead);

// Delete a specific notification
router.route("/:id").delete(deleteNotification);

// Mark all notifications as read
router.route("/mark-all-read").patch(markAllNotificationsAsRead);

// Delete all notifications
router.route("/clear-all").delete(clearAllNotifications);

export default router;

