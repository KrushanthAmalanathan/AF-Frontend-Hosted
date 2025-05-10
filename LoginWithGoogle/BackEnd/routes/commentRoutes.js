import express from 'express';
import * as cc from '../controllers/commentController.js';
const router = express.Router();
router.get('/:articleId', cc.getComments);
router.post('/:articleId', cc.addComment);
router.post('/like/:id', cc.likeComment);
export default router;