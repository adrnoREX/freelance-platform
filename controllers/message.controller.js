import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";
import gigModel from "../models/gig.model.js";

export const createMessage = async (req, res, next) => {
  try {
    const { gigId, text } = req.body;
    const from = new mongoose.Types.ObjectId(req.user.id);
    const role = req.user.role;

    
    if (!gigId || !text) {
      return next(createError(400, "Missing gigId or text"));
    }

    const images = req.files; // array of image files

    
    if (!mongoose.Types.ObjectId.isValid(gigId)) {
      return next(createError(400, "Invalid gig ID format"));
    }

    
    const gig = await gigModel.findById(gigId);
    if (!gig) {
      return next(createError(404, "Gig not found"));
    }

    let to;

    if (role === "client") {
      to = gig.userId;  
      
      
      if (!gig.clientId) {
        const updatedGig = await gigModel.findByIdAndUpdate(
          gigId,
          { clientId: from },
          { new: true }
        );
        if (!updatedGig) {
          
          return next(createError(500, "Failed to update gig"));
        }
      }
    } else if (role === "freelancer") {
      
      if (gig.clientId) {
        to = gig.clientId;
        
        
        if (to.toString() === from.toString()) {
          return next(createError(400, "Cannot send message to yourself"));
        }
      }
      
    } else {
      return next(createError(403, "Invalid user role"));
    }

   
    const newMessage = new Message({
      from,
      to,
      gigId: new mongoose.Types.ObjectId(gigId),
      text,
      images,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    console.error("Message Creation Error:", err);
    

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return next(createError(400, `Validation failed: ${errors.join(', ')}`));
    }
    
    if (err.name === 'CastError') {
      return next(createError(400, `Invalid ID format: ${err.path}`));
    }
    
    next(err);
  }
};



export const getMessages = async (req, res, next) => {
  try {
    const userObjectId = new mongoose.Types.ObjectId(req.user.id);
    const gigId = req.query.gigId;
    console.log("Fetching messages for gigId:", gigId, "and userId:", userObjectId);
    const messages = await Message.find({
      gigId,
      $or: [{ from: userObjectId }, { to: userObjectId }],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (err) {
    next(err);
  }
};
