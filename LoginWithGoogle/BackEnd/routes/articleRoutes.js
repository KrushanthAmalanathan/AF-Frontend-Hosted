// BackEnd/routes/articleRoutes.js
import express from 'express';
import * as ac from '../controllers/articleController.js';
const router = express.Router();

// POST   /api/articles/country/:code
router.post('/country/:code', ac.createArticle);

// GET    /api/articles/country/:code
router.get('/country/:code', ac.getArticlesByCountry);

// POST   /api/articles/like/:id
router.post('/like/:id', ac.likeArticle);

export default router;
