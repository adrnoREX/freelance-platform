import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type:String,
    required:true,
    unique:true,
  },
  email: {
    type:String,
    required:true,
    unique:true,
  },
  password: {
    type:String,
    required:true,
  },
  img: {
    type:String,
    required:true,
  },
  role: {
    type: String,
    enum: ["client", "freelancer"],
    required: false,
  },
  goalType: {
    type: String,
    required: false,
  },
  teamSize: {
    type: String,
    required: false,
  },
  intent: {
    type: String,
    required: false,
  },
}, {
    timestamps:true
});

export default mongoose.model("User", userSchema)