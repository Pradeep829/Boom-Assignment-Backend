const express = require('express');
const multer = require('multer');
const Video = require('../models/Video');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Upload video
router.post('/upload', auth, upload.single('video'), async (req, res) => {
  const { title } = req.body;
  try {
    const video = new Video({
      title,
      filename: req.file.filename,
    });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Like a video
router.post('/like/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(video);
  } catch {
    res.status(400).json({ error: 'Invalid video ID' });
  }
});

module.exports = router;
