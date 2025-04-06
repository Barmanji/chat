import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    accessOrCreateOneToOneChat,
    fetchUserChats,
    createGroup,
    updateGroupInfo,
    deleteGroup,
    addMembersToGroup,
    removeMembersFromGroup,
    getChatById,
    markMessagesAsSeen
} from "../controllers/chat.controller.js";

const router = express.Router();

// Protected routes
router.use(verifyJWT);

// Create or access 1-to-1 chat
router.route("/one-to-one/:targetUserId").post(accessOrCreateOneToOneChat);

// Get all chats for current user (1-1 and group)
router.route("/").get(fetchUserChats);

// Get a single chat by ID (for fetching typing users, etc.)
router.route("/:chatId").get(getChatById);

// Mark all messages as seen in a chat
router.route("/:chatId/seen").put(markMessagesAsSeen);

// GROUP CHAT ROUTES
router.route("/group/create").post(createGroup);
router.route("/group/update/:groupId").put(updateGroupInfo);
router.route("/group/delete/:groupId").delete(deleteGroup);
router.route("/group/:groupId/add").put(addMembersToGroup);
router.route("/group/:groupId/remove").put(removeMembersFromGroup);

export default router;

