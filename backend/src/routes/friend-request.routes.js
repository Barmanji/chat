import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    sendFriendRequest,
    respondToFriendRequest,
    cancelFriendRequest,
    getPendingFriendRequests,
    getSentFriendRequests
} from "../controllers/friendRequest.controller.js";

const router = express.Router();

// Protected routes
router.use(verifyJWT);

// Send a friend request
router.route("/send/:targetUserId").post(sendFriendRequest);

// Accept or reject a friend request
router.route("/respond/:requestId").put(respondToFriendRequest);

// Cancel a sent friend request
router.route("/cancel/:requestId").delete(cancelFriendRequest);

// Get friend requests sent to current user
router.route("/received").get(getPendingFriendRequests);

// Get friend requests sent by current user
router.route("/sent").get(getSentFriendRequests);

export default router;

