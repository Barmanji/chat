import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Chat } from "../models/chat/chat.model.js";

const createChat = asyncHandler(async (req, res) => {})

const getUserChats = asyncHandler(async (req, res) => {})

const getChatById = asyncHandler(async (req, res) => {})

const addUserToGroup = asyncHandler(async (req, res) => {})

const removeUserFromGroup = asyncHandler(async (req, res) => {})

const updateTypingStatus = asyncHandler(async (req, res) => {
    //6. updateTypingStatus(chatId, userId, isTyping)
})

const deleteChat = asyncHandler(async (req, res) => {})

const createGroupChat = asyncHandler(async (req, res) => {
    //8. createGroupChat(name, description, members[], adminId)
})
