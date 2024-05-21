// client/src/components/VideoSearch.jsx
import React, { useState } from 'react';
import axios from 'axios';

const VideoSearch = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get('/api/search', {
        params: { query }
      });
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  return (
    <div>
      <h1>Search YouTube Videos</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for videos"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {videos.map((video) => (
          <div key={video.videoId}>
            <h3>{video.title}</h3>
            <img src={video.thumbnail} alt={video.title} />
            <p>{video.description}</p>
            <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
              Watch on YouTube
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSearch;
