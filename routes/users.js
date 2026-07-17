const express = require('express');
const db = require('../models/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// GET USER PROFILE
router.get('/:id', (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, bio, createdAt FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const followerCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE followingId = ?').get(req.params.id).count;
    const followingCount = db.prepare('SELECT COUNT(*) as count FROM follows WHERE followerId = ?').get(req.params.id).count;

    res.json({ ...user, followerCount, followingCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FOLLOW A USER
router.post('/:id/follow', authenticateToken, (req, res) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot follow yourself' });
    }
    const stmt = db.prepare('INSERT INTO follows (followerId, followingId) VALUES (?, ?)');
    stmt.run(req.user.id, req.params.id);
    res.status(201).json({ message: 'Followed successfully' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Already following this user' });
    }
    res.status(500).json({ error: err.message });
  }
});

// UNFOLLOW A USER
router.delete('/:id/follow', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM follows WHERE followerId = ? AND followingId = ?').run(req.user.id, req.params.id);
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;