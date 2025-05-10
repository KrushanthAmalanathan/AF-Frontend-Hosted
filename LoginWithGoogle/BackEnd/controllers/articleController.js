// BackEnd/controllers/articleController.js
import { Article } from '../models/articleModel.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// compute __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // get original extension
    const ext = path.extname(file.originalname).toLowerCase();
    // name file with timestamp + original extension
    cb(null, `${Date.now()}${ext}`);
  }
});

// only allow jpg, jpeg, png, gif
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, jpeg, png, gif) are allowed'), false);
  }
};

// export a configured upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // optional: limit to 5MB
});

export const createArticle = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { title, description } = req.body;
      const imageUrl = req.file
        ? `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
        : null;

      const art = await Article.create({
        countryCode: req.params.code,
        title,
        description,
        imageUrl
      });

      return res.status(201).json(art);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Could not create article' });
    }
  }
];

export const getArticlesByCountry = async (req, res) => {
  try {
    const arts = await Article.find({ countryCode: req.params.code })
      .populate('comments')
      .sort({ createdAt: -1 });
    return res.json(arts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not fetch articles' });
  }
};

export const likeArticle = async (req, res) => {
  try {
    const art = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    return res.json(art);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Could not like article' });
  }
};
