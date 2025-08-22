import Gig from "../models/gig.model.js";
import User from "../models/user.model.js";
import FreelancerProfile from "../models/freelancer.model.js";
import createError from "../utils/createError.js";

export const createGig = async (req, res) => {
  try {
    console.log(req.user)
    const {
      title,
      desc,
      category,
      skills,
      price,
      deliveryTime,
      revisionNumber,
      shortTitle,
      shortDesc,
      features,
      tags,
      profile, 
    } = req.body;

    let parsedSkills = [];
    try {
      parsedSkills = JSON.parse(skills);
    } catch (err) {
      return res.status(400).json({
        message: "Invalid 'skills' format. It should be a JSON array.",
      });
    }

    let profileData;
    try {
      profileData = JSON.parse(profile);
    } catch (err) {
      return res.status(400).json({
        message: "Invalid 'profile' format. Must be JSON stringified object.",
      });
    }

    const existingProfile = await FreelancerProfile.findOne({ userId: req.user.id });
    if (existingProfile) {
      await FreelancerProfile.findOneAndUpdate(
        { userId: req.user.id },
        { $set: profileData },
        { new: true }
      );
    } else {
      const newProfile = new FreelancerProfile({ userId: req.user.id, ...profileData });
      await newProfile.save();
    }

    const newGig = new Gig({
      userId: req.user.id,
      title,
      desc,
      category,
      skills: parsedSkills,
      price,
      deliveryTime,
      revisionNumber,
      shortTitle,
      shortDesc,
      features: features?.split(",") || [],
      tags: Array.isArray(tags) ? tags : [tags],
      cover: req.files?.cover?.map((file) => file.filename) || "noimage.jpg",
      images: (req.files?.images || []).map((f) => f.filename),
    });

    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    console.error("Gig creation error:", err);
    res.status(500).json({ message: "Gig creation failed", error: err.message });
  }
};

export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    const user = await User.findById(gig.userId).select("username img");
    const profile = await FreelancerProfile.findOne({ userId: gig.userId });
    res.status(200).send({
      gig,
      user,
      profile,
    });
  } catch (err) {
    next(err);
  }
};



export const getGigs = async (req, res, next) => {
  try {
    const q = req.query;

    const filters = {
      ...(q.userId && { userId: q.userId }),
      ...(q.category && {
        category: { $regex: new RegExp(`^${q.category}$`, "i") },
      }),
      ...((q.min || q.max) && {
        price: {
          ...(q.min && { $gte: parseInt(q.min) }),
          ...(q.max && { $lte: parseInt(q.max) }),
        },
      }),
      ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    };

    const sortField = q.sort || "createdAt";
    const gigs = await Gig.find(filters).sort({ [sortField]: -1 });
    res.status(200).send(gigs);
  } catch (err) {
    console.error("Error in getGigs:", err);
    next(err);
  }
};
