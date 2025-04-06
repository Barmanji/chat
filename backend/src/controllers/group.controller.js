import { Group } from "../models/group/group.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler";

const createGroup = asyncHandler(async (req, res) => {});

const updateGroupInfo = asyncHandler(async (req, res) => {});

const deleteGroup = asyncHandler(async (req, res) => {});

const addMembersToGroup = asyncHandler(async (req, res) => {});

const removeMembersFromGroup = asyncHandler(async (req, res) => {});

const getGroupById = asyncHandler(async (req, res) => {});

const getUserGroups = asyncHandler(async (req, res) => {});

const leaveGroup = asyncHandler(async (req, res) => {});

const getGroupMembers = asyncHandler(async (req, res) => {});

export {
    createGroup,
    updateGroupInfo,
    deleteGroup,
    addMembersToGroup,
    removeMembersFromGroup,
    getGroupById,
    getUserGroups,
    leaveGroup,
    getGroupMembers,
}
