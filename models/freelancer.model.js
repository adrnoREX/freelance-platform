import mongoose from "mongoose";
const { Schema } = mongoose;

const freelancerSchema = new Schema(
  {
    userId: {
      type: String,
      required: true
    },
    fullName: String,
    displayName: String,
    serviceOffered: String,
    bio: String,
    country: String,
    memberSince: Date,
    languages: [String],
    shortDescription: String,
    profileImage: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Freelancer", freelancerSchema);
