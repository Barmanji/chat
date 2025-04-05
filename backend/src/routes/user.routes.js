import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserProfilePicture,
    updateUserBio,
    getFriendsList,
    getUserProfile
} from "../controllers/user.controller.js";


const router = express.Router();

// Public routes
router.route("/register").post(
    //injecting middleware!! for file handling
    upload.fields([
        {
            name: "profilePicture", maxCount: 1
        },
    ]),
    registerUser
)
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Protected routes
router.use(verifyJWT); // applied to all routes below this line COOL AF

router.route("/logout").post(logoutUser);
router.route("/curren-user").get(getCurrentUser);
router.route("/change-password").put(changeCurrentPassword);
router.route("/update-account").put(updateAccountDetails);
router.route("/update-avatar").put(upload.single("avatar"), updateUserProfilePicture);
router.route("/update-bio").put(updateUserBio);
router.route("/friends").get(getFriendsList);
router.route("/c/:username").get(getUserProfile);

export default router;

