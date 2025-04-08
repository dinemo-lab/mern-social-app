import { Schema, model } from 'mongoose';

const chatSchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  isGroup: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }
}, {
  timestamps: true
});

const Chat = model('Chat', chatSchema);

export default Chat;