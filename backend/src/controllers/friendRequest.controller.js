import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { FriendRequest } from "../models/friends/friendRequest.model.js";

const sendFriendRequest = asyncHandler(async (req, res) => {});

const getOutgoingRequests = asyncHandler(async (req, res) => {});

const getIncomingRequests = asyncHandler(async (req, res) => {});

const cancelSentRequest = asyncHandler(async (req, res) => {});

const acceptIncomingFriendRequest = asyncHandler(async (req, res) => {});

const rejectIncomingFriendRequest = asyncHandler(async (req, res) => {});

export {
    sendFriendRequest,
    getOutgoingRequests,
    getIncomingRequests,
    cancelSentRequest,
    acceptIncomingFriendRequest,
    rejectIncomingFriendRequest,
};
