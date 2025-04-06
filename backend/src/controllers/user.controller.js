import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user/user.model.js";
import {
    uploadResultCloudinary,
    deleteFromCloudinary,
} from "../utils/fileUploaderCloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullname, password } = req.body;
    if (
        [username, email, fullname, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(
            400,
            "All fields are compulsory - username, email, fullname, password"
        ); //i am writing all the apierror according to the class ApiError that i made insite UTILS
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existedUser) {
        // retuns true then;
        throw new ApiError(409, "User with this email already exists");
    }

    const profilePictureLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path; //[0] is for first property
    if (!profilePictureLocalPath) {
        throw new ApiError(
            400,
            "Profile image isn't uploaded properly locally"
        );
    }

    const profilePictureUploadedOnClodinary = await uploadResultCloudinary(
        profilePictureLocalPath
    );
    if (!profilePictureUploadedOnClodinary) {
        throw new ApiError(
            400,
            "Profile image isn't uploaded properly on cloudinary"
        );
    }

    //console.log("req.files: ",req.files)
    const user = await User.create({
        fullname,
        profilePicture: profilePictureUploadedOnClodinary.url,
        email,
        password,
        username: username.toLowerCase().trim(), // well i have alaready trimmed it
    });
    const createdUserInMongoDB = await User.findById(user._id).select(
        "-password -refreshToken"
    ); //- sign means discard it " " means
    if (!createdUserInMongoDB)
        throw new ApiError(
            500,
            "Error with registering user in MongoDB, please try again"
        );

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                createdUserInMongoDB,
                "User Registered succesfully"
            )
        );
});

const loginUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username && !email) {
        throw new ApiError(
            400,
            "Atleast one of the field is required -> Email or Username"
        );
    }
    //User.findOne({email}) --> this is valid as wellfor email only or for username just change it to username
    const findUser = await User.findOne({
        $or: [{ email }, { username }], //better syntax
    });
    if (!findUser) {
        throw new ApiError(
            404,
            "This user doesn't exist with this email or username"
        );
    }
    const passwordValidity = await findUser.isPasswordCorrect(password);
    if (!passwordValidity) {
        throw new ApiError(401, "Invalid user credentials");
    }
    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(
        findUser._id
    );
    const loggedInUser = await User.findById(findUser._id).select(
        "-password -refreshToken"
    ); //little optional
    const option = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(
                200,
                {
                    findUser: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in succesfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 }, //this removes the field of the doc
        },
        {
            new: true,
        }
    );

    const option = {
        httpOnly: true,
        secure: true, // to use only in HTTPS addresses
    };

    return res
        .status(200)
        .clearCookie("accessToken", option) //method by cookieparser to clear
        .clearCookie("refreshToken", option)
        .json(new ApiResponse(200, {}, "User Logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken; //.cookies for pc, .body for mobiles

    if (!incomingRefreshToken) {
        throw new ApiError(404, "Unauthorized request");
    }
    //now refresh the incoming ref.
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(400, "Fictitious Token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
        const options = {
            httpOnly: true,
            secure: true,
        };
        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken,
                    },
                    "access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token");
    }
});

//-------------- CHANGE PASS --------------------/
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current user fetched successfully")
        );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { username, fullname, email } = req.body;
    if (!fullname || !username || !email) {
        throw new ApiError(400, "All fields are necessary");
    }
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname, //only fullname can be enf due to ES6 , READ about ES6
                email: email,
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Account details added succesfully"));
});

const updateUserProfilePicture = asyncHandler(async (req, res) => {
    const profilePictureLocalPath = req.file?.path;

    if (!profilePictureLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    const oldProfilePicture = req.user?.profilePicture;
    oldProfilePicture && (await deleteFromCloudinary(oldProfilePicture)); //not understood
    const newProfilePictureUploadedOnClodinary = await uploadResultCloudinary(
        profilePictureLocalPath
    );

    if (!newProfilePictureUploadedOnClodinary.url) {
        throw new ApiError(400, "Error while uploading profile picture");
    }
    const profilePicuteUpdationOnMongoDB = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                profilePicture: newProfilePictureUploadedOnClodinary.url,
            },
        },
        { new: true }
    ).select("-password");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                profilePicuteUpdationOnMongoDB,
                "Profile updated successfully"
            )
        ); //avatar.url is unnecrary and has been put by none other than BARMANJI
});

const updateUserBio = asyncHandler(async (req, res) => {
    const { bio } = req.body;

    if (typeof bio !== "string" || !bio.trim()) {
        throw new ApiError(400, "Invalid bio");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { bio: bio.trim() } },
        { new: true } // returns the updated document rather than the original
    ).select("-password"); // returns the user without the password field

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Bio updated successfully"));
});

const getFriendsList = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const userWithFriends = await User.findOne({username}).populate({
        path: "friends",
        select: "_id username fullname profilePicture status",
    });
    if (!userWithFriends) {
        throw new ApiError(404, "User not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, userWithFriends.friends, "Friend list fetched")
        );
});

const getUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    if (!username?.trim()) {
        //can be done as !username?.trim()
        throw new ApiError(400, "Username is not found");
    }
    const dashboard = await User.aggregate([
        {
            $match: { username: username.toLowerCase() },
        },
        {
            $lookup: {
                from: "users", // same collection
                localField: "friends",
                foreignField: "_id",
                as: "friendsList",
            },
        },
        {
            $project: {
                username: 1,
                fullname: 1,
                email: 1,
                bio: 1,
                profilePicture: 1,
                status: 1,
                friendsList: {
                    $map: {
                        input: "$friendsList",
                        as: "friend",
                        in: {
                            _id: "$$friend._id",
                            username: "$$friend.username",
                            fullname: "$$friend.fullname",
                            profilePicture: "$$friend.profilePicture",
                            status: "$$friend.status",
                        },
                    },
                },
            },
        },
    ]);

    if (!dashboard?.length) {
        throw new ApiError(404, "dashboard doesnt exist");
    }
    console.log("dashboard: ", dashboard);
    console.log("req.params :", req.params);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channel[0],
                "User dashboard fetched succesfully"
            )
        );
});

export {
    generateAccessAndRefreshTokens,
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
    getUserProfile,
};
