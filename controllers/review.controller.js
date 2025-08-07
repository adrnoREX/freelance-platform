import createError from "../utils/createError.js";
import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";

export const createReview = async (req, res, next) => {
  const gigExists = await Gig.findById(req.body.gigId);
  if (!gigExists) {
    return next(createError(404, "Gig not found"));
  }
  if (req.role === "freelancer")
    return next(createError(403, "Freelancers can't create a review!"));

  const newReview = new Review({
    userId: req.userId,
    gigId: req.body.gigId,
    desc: req.body.desc,
    star: req.body.star,
  });

  try {
    const review = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId,
    });

    if (review)
      return next(
        createError(403, "You have already created a review for this gig!")
      );


    const savedReview = await newReview.save();
    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });
    res.status(201).send(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.id });
    res.status(200).send(reviews);
  } catch (err) {
    next(err);
  }
};
export const deleteReview = async (req, res, next) => {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) return next(createError(404, "Review not found"));
  
      if (review.userId !== req.userId) {
        return next(createError(403, "You can delete only your own review"));
      }
  
      await Review.findByIdAndDelete(req.params.id);

      await Gig.findByIdAndUpdate(review.gigId, {
        $inc: {
          totalStars: -review.star,
          starNumber: -1,
        },
      });
  
      res.status(200).send("Review deleted successfully");
    } catch (err) {
      next(err);
    }
  };
  
