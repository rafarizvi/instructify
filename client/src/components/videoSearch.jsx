import { useState } from 'react';
// Import axios to make a GET request to the YouTube API
import axios from 'axios';
// Import mutation to save video to tutorial
import { useMutation } from '@apollo/client'; // Import useMutation
import { SAVE_VIDEO_TO_TUTORIAL } from '../utils/mutations';

// Setting our constant for the API endpoint
const YOUTUBE = 'https://www.googleapis.com/youtube/v3/search';

// This function will make a GET request to the YouTube API and return a list of videos matching the search term.
export async function getVideos(searchTerm) {
  // We will use the API key from our .env file
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  
  // Trying to get the data from the API
  try {
    // We will use the axios library to make a GET request to the YouTube API
    const response = await axios.get(YOUTUBE, {
      // Setting query parameters
      params: {
        part: 'snippet',
        q: searchTerm,
        type: 'video',
        maxResults: 10,
        key: apiKey,
      },
    });
    // We will return the data from the API
    return response.data.items;
  } catch (error) {
    console.error('Error fetching videos from YouTube API:', error);
    throw error;
  }
}

// Exporting the VideoSearch component to handle the form submission and video display
export default function VideoSearch() {
  // Setting up state variables
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [error, setError] = useState(null);

  // Setting a function to handle save video using mutation
  const [saveVideo] = useMutation(SAVE_VIDEO_TO_TUTORIAL, {
    onCompleted: () => alert('Video saved to your tutorials!'),
    onError: (error) => alert('Error saving video: ' + error.message),
  });

  // Event handler for input change
  const handleInputChange = (event) => {
    // Setting the search term to the value of the input field
    setSearchTerm(event.target.value);
  };

  // Event handler for form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    // Making a GET request to the YouTube API
    try {
      // Setting the state of the videos to the data returned from the API
      const fetchedVideos = await getVideos(searchTerm);
      setVideos(fetchedVideos);
      setSelectedVideoId(null);
    } catch (error) {
      setError('Error fetching videos: ' + error.message);
    }
  };

  // Event handler for video click
  const handleVideoClick = (videoId) => {
    setSelectedVideoId(videoId);
  };

  // Handling the save button for the video
  const handleSaveVideo = (video) => {
    saveVideo({
      variables: {
        title: video.snippet.title,
        videoId: video.id.videoId,
        thumbnail: video.snippet.thumbnails.default.url,
        content: 'Default content for the tutorial.', // Ensure content is provided
      },
    });
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
            <li key={video.id.videoId} style={{ cursor: 'pointer' }}>
              <div onClick={() => handleVideoClick(video.id.videoId)}>
                <h3>{video.snippet.title}</h3>
                {selectedVideoId === video.id.videoId ? (
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    frameBorder="0"
                    // Accelerometer and gyroscope are needed for the video to work on mobile devices
                    // Autoplay is needed for the video to start playing automatically
                    // AllowFullScreen is needed for the video to be full screen
                    // Picture in picture is needed for the video to be in picture in picture mode
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Selected Video"
                  ></iframe>
                ) : (
                  <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
                )}
              </div>
              <button className="btn btn-secondary mt-2" onClick={() => handleSaveVideo(video)}>
                Save to My Tutorials
              </button>
            </li>
          ))
        ) : (
          <li>No videos found</li>
        )}
      </ul>
    </div>
  );
}
