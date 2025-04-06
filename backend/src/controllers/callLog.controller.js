import { CallLog } from "../models/chat/chat.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";

const createCallLog = asyncHandler(async (req, res) => {});
const getUserCallLogs = asyncHandler(async (req, res) => {});
const getCallLogById = asyncHandler(async (req, res) => {});
const deleteCallLog = asyncHandler(async (req, res) => {});

export {
    createCallLog,
    getUserCallLogs,
    getCallLogById,
    deleteCallLog,
}
