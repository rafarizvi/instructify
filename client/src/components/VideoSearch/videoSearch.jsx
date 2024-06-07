import '../../App.css'
import '../../index.css'

import {
  useState,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
  useMutation,
  useQuery,
  SAVE_VIDEO_TO_TUTORIAL,
  QUERY_USER_TUTORIALS,
  QUERY_GET_TUTORIAL_DETAILS,
  getVideos
} from './index'


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

    saveVideo({
      variables: {
        title: video.snippet.title,
        videoId: video.id.videoId,
        thumbnail: video.snippet.thumbnails.default.url,
        tutorialId: selectedTutorialId,
      },
    });
  };

  if(loading) {
    <div>
      <p>Loading tutorials...please wait</p>
    </div>
  }

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
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      <Row className="mt-3">
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map((video) => (
            <Col
              key={video.id.videoId}
              md={selectedVideoId === video.id.videoId ? 12 : 4}
              className={selectedVideoId === video.id.videoId ? 'mb-4' : 'mb-4'}
            >
              <Card
                onClick={() => handleVideoClick(video.id.videoId)}
                className={`video-item ${selectedVideoId === video.id.videoId ? 'selected' : ''}`}
              >
                {selectedVideoId === video.id.videoId ? (
                  <Card.Body className="p-0">
                    <iframe
                      width="100%"
                      height="400px"
                      src={`https://www.youtube.com/embed/${video.id.videoId}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title="Selected Video"
                    ></iframe>
                  </Card.Body>
                ) : (
                  <Card.Img
                    variant="top"
                    src={video.snippet.thumbnails.high.url}
                    alt={video.snippet.title}
                    style={{ height: '250px', width: '100%' }}
                  />
                )}
                <Card.Body>
                  <Card.Title className="video-title">{video.snippet.title}</Card.Title>
                  {savingVideoId === video.id.videoId ? (
                    <>
                      <Form.Control
                        as="select"
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
                      </Form.Control>
                      <Button variant="primary" className="mt-2" onClick={() => handleSaveVideo(video)}>
                        Save Video
                      </Button>
                    </>
                  ) : (
                    <Button variant="secondary" className="mt-2" onClick={() => handleSaveVideoClick(video.id.videoId)}>
                      Save to My Tutorials
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="no-videos-found">Search videos and save them to your tutorials.</Col>
        )}
      </Row>
    </div>
  );
}
