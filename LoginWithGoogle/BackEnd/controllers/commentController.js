import { Comment } from '../models/commentModel.js';
import { Article } from '../models/articleModel.js';
import * as cc from '../controllers/commentController.js';


export const getComments = async (req, res) => {
  const comments = await Comment.find({ article: req.params.articleId });
  res.json(comments);
};
export const addComment = async (req, res) => {
  const c = await Comment.create({ article: req.params.articleId, content: req.body.content });
  await Article.findByIdAndUpdate(req.params.articleId, { $push: { comments: c._id } });
  res.json(c);
};
export const likeComment = async (req, res) => {
  const c = await Comment.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
  res.json(c);
};
