import { useState } from 'react';
import '../App.css';
import '../index.css';
import { useMutation, useQuery } from '@apollo/client';
import { SAVE_VIDEO_TO_TUTORIAL } from '../utils/mutations';
import { QUERY_USER_TUTORIALS, QUERY_GET_TUTORIAL_DETAILS } from '../utils/queries';
import { getVideos } from '../utils/youtubeApi';

export default function VideoSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [savingVideoId, setSavingVideoId] = useState(null);
  const [error, setError] = useState(null);
  const [selectedTutorialId, setSelectedTutorialId] = useState('');

  const { loading, data } = useQuery(QUERY_USER_TUTORIALS);
  const tutorials = data?.me?.tutorials || [];

  const [saveVideo] = useMutation(SAVE_VIDEO_TO_TUTORIAL, {
    update(cache, { data: { saveVideoToTutorial } }) {
      const { _id: tutorialId, videos } = saveVideoToTutorial;
      const existingTutorial = cache.readQuery({
        query: QUERY_GET_TUTORIAL_DETAILS,
        variables: { tutorialId },
      });

      if (existingTutorial) {
        cache.writeQuery({
          query: QUERY_GET_TUTORIAL_DETAILS,
          variables: { tutorialId },
          data: {
            tutorial: {
              ...existingTutorial.tutorial,
              videos: [...existingTutorial.tutorial.videos, ...videos],
            },
          },
        });
      }
    },
    onCompleted: () => {
      alert('Video saved to your tutorials!');
      setSavingVideoId(null);
      setSelectedTutorialId('');
    },
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

  const handleSaveVideoClick = (videoId) => {
    setSavingVideoId(videoId);
  };

  const handleSaveVideo = (video) => {
    if (!selectedTutorialId) {
      alert('Please select a tutorial to save the video to.');
      return;
    }
  
    console.log('Saving video with parameters:', {
      title: video.snippet.title,
      videoId: video.id.videoId,
      thumbnail: video.snippet.thumbnails.default.url,
      content: 'Default content for the tutorial.',
      tutorialId: selectedTutorialId,
    });
  
    saveVideo({
      variables: {
        title: video.snippet.title,
        videoId: video.id.videoId,
        thumbnail: video.snippet.thumbnails.default.url,
        content: 'Default content for the tutorial.',
        tutorialId: selectedTutorialId,
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
              {savingVideoId === video.id.videoId ? (
                <div>
                  <select
                    value={selectedTutorialId}
                    onChange={(e) => setSelectedTutorialId(e.target.value)}
                    className="tutorial-select"
                  >
                    <option value="">Select a tutorial</option>
                    {tutorials.map((tutorial) => (
                      <option key={tutorial._id} value={tutorial._id}>
                        {tutorial.title}
                      </option>
                    ))}
                  </select>
                  <button className="btn btn-primary mt-2" onClick={() => handleSaveVideo(video)}>
                    Save Video
                  </button>
                </div>
              ) : (
                <button className="btn btn-secondary mt-2" onClick={() => handleSaveVideoClick(video.id.videoId)}>
                  Save to My Tutorials
                </button>
              )}
            </li>
          ))
        ) : (
          <li className="no-videos-found">Search videos and save them to your tutorials.</li>
        )}
      </ul>
    </div>
  );
}
