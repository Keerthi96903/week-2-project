import User from "../models/User.js";
import createError from 'http-errors';

// Utility for sending success response
const sendSuccessResponse = (res, statusCode, message, data) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// Utility for sending error response
const sendErrorResponse = (res, statusCode, message, error = {}) => {
  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error : undefined,
  });
};

// Create a new User
export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    sendSuccessResponse(res, 201, "User successfully created", savedUser);
  } catch (err) {
    sendErrorResponse(res, 500, "Failed to create user", err);
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true });
    if (!updatedUser) {
      return sendErrorResponse(res, 404, "User not found");
    }
    sendSuccessResponse(res, 200, "User successfully updated", updatedUser);
  } catch (err) {
    sendErrorResponse(res, 500, "Failed to update user", err);
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return sendErrorResponse(res, 404, "User not found");
    }
    sendSuccessResponse(res, 200, "User successfully deleted");
  } catch (err) {
    sendErrorResponse(res, 500, "Failed to delete user", err);
  }
};

// Get a single user by ID
export const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return sendErrorResponse(res, 404, "User not found");
    }
    sendSuccessResponse(res, 200, "User found", user);
  } catch (err) {
    sendErrorResponse(res, 500, "Failed to retrieve user", err);
  }
};

// Get all users with pagination
export const getAllUser = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Pagination params
  try {
    const users = await User.find()
      .skip((page - 1) * limit) // Pagination logic
      .limit(Number(limit));

    if (!users.length) {
      return sendErrorResponse(res, 404, "No users found");
    }

    sendSuccessResponse(res, 200, "Users retrieved successfully", users);
  } catch (err) {
    sendErrorResponse(res, 500, "Failed to retrieve users", err);
  }
};
