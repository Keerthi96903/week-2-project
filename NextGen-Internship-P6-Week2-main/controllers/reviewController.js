import Tour from "../models/Tour.js";
import Review from "../models/Review.js";

// Create a review
export const createReview = async (req, res) => {
  const tourId = req.params.tourId;
  const newReview = new Review({ ...req.body });

  try {
    const savedReview = await newReview.save();

    // After creating a new review, update the reviews array of the tour
    const updatedTour = await Tour.findByIdAndUpdate(
      tourId,
      { $push: { reviews: savedReview._id } },
      { new: true } // Ensure the updated document is returned
    );

    if (!updatedTour) {
      return res.status(404).json({
        success: false,
        message: "Tour not found. Unable to add review.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review submitted successfully.",
      data: savedReview,
    });
  } catch (err) {
    console.error(`[Error] Failed to create review for tour ${tourId}: ${err.message}`);
    res.status(500).json({
      success: false,
      message: "Failed to submit review. Please try again later.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
