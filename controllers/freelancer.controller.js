import FreelancerProfile from "../models/freelancer.model.js";
import createError from "../utils/createError.js";
import mongoose from "mongoose";
export const createFreelancerProfile = async (req, res, next) => {
  try {
    const exists = await FreelancerProfile.findOne({ userId: req.userId });
    if (exists) return next(createError(400, "Profile already exists"));

    const profile = new FreelancerProfile({ userId: req.userId, ...req.body });
    const saved = await profile.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

export const getFreelancerProfile = async (req, res, next) => {
  try {
    const profile = await FreelancerProfile.findOne({ userId: req.params.id });
    if (!profile) {
      return next(createError(404, "Freelancer profile not found"));
    }
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
};

export const updateFreelancerProfile = async (req, res, next) => {
  try {
    const updated = await FreelancerProfile.findOneAndUpdate(
      { userId: req.params.userId },
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};
