import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: [String],
    default: []
  }
}, { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
