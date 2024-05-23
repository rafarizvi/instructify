// client/src/components/VideoSearch.jsx
import { useState } from 'react';
import axios from 'axios';

const YOUTUBE = 'https://www.googleapis.com/youtube/v3/search';

export async function getVideos(searchTerm) {
  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  console.log("API Key:", apiKey);  // Add the console log here
  try {
    const response = await axios.get(YOUTUBE, {
      params: {
        part: 'snippet',
        q: searchTerm,
        type: 'video',
        maxResults: 10,
        key: apiKey,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching videos from YouTube API:', error);
    throw error;
  }
}

export default function VideoSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const fetchedVideos = await getVideos(searchTerm);
      setVideos(fetchedVideos);
    } catch (error) {
      setError('Error fetching videos: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Video Search Page</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          placeholder="Search for videos"
          value={searchTerm}
          onChange={handleInputChange}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      <ul className="mt-3">
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map((video) => (
            <li key={video.id.videoId}>
              <div>
                <h3>{video.snippet.title}</h3>
                <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
              </div>
            </li>
          ))
        ) : (
          <li>No videos found</li>
        )}
      </ul>
    </div>
  );
}
