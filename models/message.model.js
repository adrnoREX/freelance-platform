import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, required: true },
    to: { type: mongoose.Schema.Types.ObjectId, required: false },
    gigId: { type: mongoose.Schema.Types.ObjectId, required: true },
    text: { type: String, required: true },
    delivered: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    images: [
      {type: String},
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
