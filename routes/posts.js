const express = require('express');
const db = require('../models/db');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// CREATE POST
router.post('/', authenticateToken, (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const stmt = db.prepare('INSERT INTO posts (userId, content) VALUES (?, ?)');
    const result = stmt.run(req.user.id, content);

    res.status(201).json({ id: result.lastInsertRowid, userId: req.user.id, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ALL POSTS (feed)
router.get('/', (req, res) => {
  try {
    const posts = db.prepare(`
      SELECT posts.id, posts.content, posts.createdAt, users.name as authorName, users.id as userId,
        (SELECT COUNT(*) FROM likes WHERE likes.postId = posts.id) as likeCount,
        (SELECT COUNT(*) FROM comments WHERE comments.postId = posts.id) as commentCount
      FROM posts
      JOIN users ON posts.userId = users.id
      ORDER BY posts.createdAt DESC
    `).all();

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD COMMENT
router.post('/:id/comments', authenticateToken, (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const stmt = db.prepare('INSERT INTO comments (postId, userId, content) VALUES (?, ?, ?)');
    const result = stmt.run(req.params.id, req.user.id, content);

    res.status(201).json({ id: result.lastInsertRowid, postId: req.params.id, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET COMMENTS FOR A POST
router.get('/:id/comments', (req, res) => {
  try {
    const comments = db.prepare(`
      SELECT comments.id, comments.content, comments.createdAt, users.name as authorName
      FROM comments
      JOIN users ON comments.userId = users.id
      WHERE comments.postId = ?
      ORDER BY comments.createdAt ASC
    `).all(req.params.id);

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LIKE A POST
router.post('/:id/like', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('INSERT INTO likes (postId, userId) VALUES (?, ?)');
    stmt.run(req.params.id, req.user.id);
    res.status(201).json({ message: 'Post liked' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Already liked this post' });
    }
    res.status(500).json({ error: err.message });
  }
});

// UNLIKE A POST
router.delete('/:id/like', authenticateToken, (req, res) => {
  try {
    db.prepare('DELETE FROM likes WHERE postId = ? AND userId = ?').run(req.params.id, req.user.id);
    res.json({ message: 'Post unliked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;