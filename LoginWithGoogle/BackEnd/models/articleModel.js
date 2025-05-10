import mongoose from 'mongoose';
const ArticleSchema = new mongoose.Schema({
  countryCode: String,
  title: String,
  description: String,
  imageUrl: String,
  likes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now },
});
export const Article = mongoose.model('Article', ArticleSchema);
