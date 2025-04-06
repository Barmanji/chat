import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    sendMessage,
    getMessagesInChat,
    deleteMessage,
    markMessageAsSeen,
    markAllMessagesAsSeen
} from "../controllers/message.controller.js";

const router = express.Router();

// Protected routes
router.use(verifyJWT);

// Send a new message
router.route("/").post(sendMessage);

// Get all messages in a chat
router.route("/:chatId").get(getMessagesInChat);

// Delete a specific message
router.route("/:id").delete(deleteMessage);

// Mark a specific message as seen
router.route("/:id/seen").patch(markMessageAsSeen);

// Mark all messages in a chat as seen
router.route("/seen/:chatId").patch(markAllMessagesAsSeen);

export default router;

