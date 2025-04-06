import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    createGroup,
    updateGroupInfo,
    deleteGroup,
    addMembersToGroup,
    removeMembersFromGroup,
    getGroupDetails,
    getMyGroups
} from "../controllers/group.controller.js";

const router = express.Router();

// Protected routes only
router.use(verifyJWT);

// Create group (with optional group picture upload)
router.route("/create").post(
    upload.fields([
        { name: "groupPicture", maxCount: 1 }
    ]),
    createGroup
);

// Update group info (name, description, picture)
router.route("/:groupId").put(
    upload.fields([
        { name: "groupPicture", maxCount: 1 }
    ]),
    updateGroupInfo
);

// Delete group
router.route("/:groupId").delete(deleteGroup);

// Add members to group
router.route("/:groupId/add-members").put(addMembersToGroup);

// Remove members from group
router.route("/:groupId/remove-members").put(removeMembersFromGroup);

// Get group details
router.route("/:groupId").get(getGroupDetails);

// Get groups current user is a member of
router.route("/").get(getMyGroups);

export default router;

