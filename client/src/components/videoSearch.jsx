import { useState } from 'react';
import '../App.css';
import '../index.css';
import { useMutation } from '@apollo/client';
import { SAVE_VIDEO_TO_TUTORIAL } from '../utils/mutations';
import { getVideos } from '../utils/youtubeApi';  // Import the function from the new file

export default function VideoSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [error, setError] = useState(null);

  const [saveVideo] = useMutation(SAVE_VIDEO_TO_TUTORIAL, {
    onCompleted: () => alert('Video saved to your tutorials!'),
    onError: (error) => alert('Error saving video: ' + error.message),
  });

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const term = searchTerm.trim() === '' ? 'search for videos' : searchTerm;

    try {
      const fetchedVideos = await getVideos(term);
      setVideos(fetchedVideos);
      setSelectedVideoId(null);
    } catch (error) {
      setError('Error fetching videos: ' + error.message);
    }
  };

  const handleVideoClick = (videoId) => {
    setSelectedVideoId(videoId);
  };

  const handleSaveVideo = (video) => {
    saveVideo({
      variables: {
        title: video.snippet.title,
        videoId: video.id.videoId,
        thumbnail: video.snippet.thumbnails.default.url,
        content: 'Default content for the tutorial.',
      },
    });
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
          <li className="no-videos-found">Search videos and save them to your tutorials.</li>
        )}
      </ul>
    </div>
  );
}