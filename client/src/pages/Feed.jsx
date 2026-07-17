import { useState, useEffect } from 'react';
import axios from 'axios';

function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await axios.post(
        'http://localhost:3000/api/posts',
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent('');
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(
        `http://localhost:3000/api/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchPosts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto' }}>
      <h2>Feed</h2>

      <form onSubmit={handlePost} style={{ marginBottom: '20px' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          style={{ width: '100%', minHeight: '60px' }}
        />
        <button type="submit">Post</button>
      </form>

      {posts.map((post) => (
        <div
          key={post.id}
          style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            marginBottom: '10px',
          }}
        >
          <strong>{post.authorName}</strong>
          <p>{post.content}</p>
          <small>{post.createdAt}</small>
          <div>
            <button onClick={() => handleLike(post.id)}>
              ❤️ {post.likeCount}
            </button>{' '}
            💬 {post.commentCount}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Feed;