import { useState } from 'react';
import '../App.css';
import '../index.css';
// import axios to make a GET request to the YouTube API
import axios from 'axios';

// setting our constant for the API key
const YOUTUBE = 'https://www.googleapis.com/youtube/v3/search';

// This function will make a GET request to the YouTube API and return a list of videos matching the search term.
export async function getVideos(searchTerm) {
  // We will use the API key from our .env file
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  // trying to get the data from the API
  try {
    // We will use the axios library to make a GET request to the YouTube API
    const response = await axios.get(YOUTUBE, {
      // then we set out query parameters
      params: {
        part: 'snippet',
        q: 'How to ' + searchTerm,
        type: 'video',
        maxResults: 10,
        key: apiKey,
      },
    });
    // We will return the data from the API
    return response.data.items;
    // If there is an error, we will log it and throw it
  } catch (error) {
    console.error('Error fetching videos from YouTube API:', error);
    throw error;
  }
}

// export functions to handle the form submission
export default function VideoSearch() {
  // We will set up our state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [error, setError] = useState(null);

  // We will set up our event handlers
  const handleInputChange = (event) => {
    // We will set the search term to the value of the input field
    setSearchTerm(event.target.value);
  };

  // setting our prevent default function to stop the form from reloading the page
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const term = searchTerm.trim() === '' ? 'search for videos' : searchTerm;
    // We will make a GET request to the YouTube API
    try {
      // We will set the state of the videos to the data returned from the API
      const fetchedVideos = await getVideos(term);
      setVideos(fetchedVideos);
      // We will set the state of the selectedVideoId to null
      setSelectedVideoId(null); 
    } catch (error) {
      setError('Error fetching videos: ' + error.message);
    }
  };

  // This function will handle the video click event
  const handleVideoClick = (videoId) => {
    setSelectedVideoId(videoId);
  };

  return (
    <div className="video-search-container">
      <h2 className="video-search-title">Video Search Page</h2>
      <form onSubmit={handleFormSubmit} className="search-bar">
        <div className="search-prefix">How to</div>
        <input
          type="text"
          placeholder="search for videos"
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      <ul className="mt-3">
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map((video) => (
            <li key={video.id.videoId} style={{ cursor: 'pointer' }}>
              <div onClick={() => handleVideoClick(video.id.videoId)}>
                <h3>{video.snippet.title}</h3>
                {selectedVideoId === video.id.videoId ? (
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    frameBorder="0"
                    // accelerometer and gyroscope are needed for the video to work on mobile devices
                    // autoplay is needed for the video to start playing automatically
                    // allowFullScreen is needed for the video to be full screen
                    // picture in picture is needed for the video to be in picture in picture mode
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Selected Video"
                  ></iframe>
                ) : (
                  <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="no-videos-found">No videos found</li>
        )}
      </ul>
    </div>
  );
}

