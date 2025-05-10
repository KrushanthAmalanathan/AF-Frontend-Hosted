import mongoose from 'mongoose';
const CommentSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  content: String,
  likes: { type: Number, default: 0 },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now },
});
export const Comment = mongoose.model('Comment', CommentSchema);
