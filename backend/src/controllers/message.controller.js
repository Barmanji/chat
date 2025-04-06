import mongoose, { isValidObjectId } from "mongoose";
import { Message } from "../models/chat/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const sendMessage = asyncHandler(async (req, res) => {

})

const getMessages = asyncHandler(async (req, res) => {})

const markAsSeen = asyncHandler(async (req, res) => {})

const markAsDelivered = asyncHandler(async (req, res) => {})

const deleteMessage = asyncHandler(async (req, res) => {})

const editMessage = asyncHandler(async (req, res) => {})

const getLastMessage = asyncHandler(async (req, res) => {})
