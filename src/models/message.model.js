import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: {
    type: String,
    required: true,
    ref: "User"
  },
  senderId: {
    type: String,
    required: true,
    ref: "User"
  },
  content: {
    type: String,
    required: true,
  }
}, { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
