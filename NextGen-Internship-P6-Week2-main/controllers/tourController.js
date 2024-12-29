import Tour from "../models/Tour.js";

// Create a new tour
export const createTour = async (req, res) => {
  try {
    const newTour = new Tour(req.body);
    const savedTour = await newTour.save();

    res.status(201).json({
      success: true,
      message: "Tour created successfully",
      data: savedTour,
    });
  } catch (err) {
    console.error(`[Error] Failed to create tour: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to create tour. Please try again.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Update a tour
export const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true } // Ensure new document is returned and validation is applied
    );

    if (!updatedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour updated successfully",
      data: updatedTour,
    });
  } catch (err) {
    console.error(`[Error] Failed to update tour: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to update tour. Please try again.",
    });
  }
};

// Delete a tour
export const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTour = await Tour.findByIdAndDelete(id);

    if (!deletedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour deleted successfully",
    });
  } catch (err) {
    console.error(`[Error] Failed to delete tour: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to delete tour. Please try again.",
    });
  }
};

// Get a single tour
export const getSingleTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id).populate("reviews");

    if (!tour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tour retrieved successfully",
      data: tour,
    });
  } catch (err) {
    console.error(`[Error] Failed to retrieve tour: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tour. Please try again.",
    });
  }
};

// Get all tours with pagination
export const getAllTour = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const limit = 8; // Define items per page
    const tours = await Tour.find({})
      .populate("reviews")
      .skip(page * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Tours retrieved successfully",
      data: tours,
    });
  } catch (err) {
    console.error(`[Error] Failed to retrieve tours: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tours. Please try again.",
    });
  }
};

// Search for tours
export const getTourBySearch = async (req, res) => {
  try {
    const { city, distance, maxGroupSize } = req.query;
    const query = {
      city: new RegExp(city, "i"),
      distance: { $gte: parseInt(distance) || 0 },
      maxGroupSize: { $gte: parseInt(maxGroupSize) || 0 },
    };

    const tours = await Tour.find(query).populate("reviews");

    if (!tours.length) {
      return res.status(404).json({
        success: false,
        message: "No tours found matching the criteria",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tours retrieved successfully",
      data: tours,
    });
  } catch (err) {
    console.error(`[Error] Failed to search tours: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to search tours. Please try again.",
    });
  }
};

// Get featured tours
export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true })
      .populate("reviews")
      .limit(8);

    res.status(200).json({
      success: true,
      message: "Featured tours retrieved successfully",
      data: tours,
    });
  } catch (err) {
    console.error(`[Error] Failed to retrieve featured tours: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve featured tours. Please try again.",
    });
  }
};

// Get total tour count
export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();

    res.status(200).json({
      success: true,
      data: tourCount,
    });
  } catch (err) {
    console.error(`[Error] Failed to retrieve tour count: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve tour count. Please try again.",
    });
  }
};
