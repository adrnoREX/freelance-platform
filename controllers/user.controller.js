import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import createError from "../utils/createError.js"
import mongoose from "mongoose";

export const getUser = async (req, res, next) => {
    try {
      

      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json("Invalid user ID");
      }

      const user = await User.findById(req.params.id).select("username img ");
      if (!user) return next(createError(404, "User not found"));
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

export const deleteUser = async (req, res, next) => {
    
    const user = await User.findById(req.params.id)
    const token = req.cookies.accessToken

    if(req.userId !== user._id.toString()){
        return next(createError(403, "you cannot delete your account if it is not login!"))
    }
    await User.findByIdAndDelete(req.params.id)
    res.status(200).send("Account has been deleted!")

} 

export const checkUserExists = async (req, res, next) => {
  try {
    const { username, email } = req.query;

    if (!username && !email) {
      return res.status(400).json({ error: "Username or email must be provided" });
    }

    const result = {
      exists: false,
      usernameTaken: false,
      emailTaken: false,
    };

    if (username) {
      const userByUsername = await User.findOne({ username });
      if (userByUsername) {
        result.exists = true;
        result.usernameTaken = true;
      }
    }

    if (email) {
      const userByEmail = await User.findOne({ email });
      if (userByEmail) {
        result.exists = true;
        result.emailTaken = true;
      }
    }

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

