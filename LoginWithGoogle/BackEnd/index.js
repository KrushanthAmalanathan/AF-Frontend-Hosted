// BackEnd/index.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { PORT, mongodbURL } from './config.js';
import articleRoutes from './routes/articleRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

// simple health check
app.get('/', (req, res) => {
  return res.status(200).send('Welcome to MERN Stack');
});

// Auth & User routes
app.use('/users', userRoute);
app.use('/auth', authRoute);

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Articles & Comments API
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);

mongoose
  .connect(mongodbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('App Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB', error);
  });
