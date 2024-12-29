import Booking from '../models/Booking.js';
import { validationResult } from 'express-validator';

// Middleware for validation (new)
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Middleware for logging (new)
const logRequestDetails = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// Create new booking
export const createBooking = [
  logRequestDetails, // Log request details
  handleValidationErrors, // Handle input validation errors
  async (req, res) => {
    const newBooking = new Booking(req.body);

    try {
      const savedBooking = await newBooking.save();
      res.status(200).json({
        success: true,
        message: 'Your tour is booked',
        data: savedBooking,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined, // Enhanced security
      });
    }
  },
];

// Get single booking
export const getBooking = [
  logRequestDetails, // Log request details
  async (req, res) => {
    const id = req.params.id;

    try {
      const book = await Booking.findById(id);
      if (!book) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        });
      }
      res.status(200).json({
        success: true,
        message: 'Booking found',
        data: book,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch booking',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined, // Enhanced security
      });
    }
  },
];

// Get all bookings
export const getAllBooking = [
  logRequestDetails, // Log request details
  async (req, res) => {
    try {
      const books = await Booking.find();
      res.status(200).json({
        success: true,
        message: 'Bookings found',
        data: books,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined, // Enhanced security
      });
    }
  },
];
