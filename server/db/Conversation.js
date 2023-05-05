import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("conversation", conversationSchema);
