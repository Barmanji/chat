import {Notification} from '../models/notification.model.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import mongoose, {isValidObjectId} from 'mongoose';
import {asyncHandler} from '../utils/asyncHandler.js';

const createNotification = asyncHandler(async (req, res) => {});
const getUserNotifications = asyncHandler(async (req, res) => {});
const markNotificationAsRead = asyncHandler(async (req, res) => {});
const deleteNotification = asyncHandler(async (req, res) => {});
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {});
const clearAllNotifications = asyncHandler(async (req, res) => {});

export {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification,
    markAllNotificationsAsRead,
    clearAllNotifications,
}

