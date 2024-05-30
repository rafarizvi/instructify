import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER_TUTORIALS } from '../utils/queries';
import { REMOVE_TUTORIAL, UPDATE_TUTORIAL, REMOVE_VIDEO_FROM_TUTORIAL } from '../utils/mutations';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './dashboard.css';

const categoryList = [
  'Tech',
  'Academics',
  'Home',
  'Arts',
  'Lifestyle/Hobbies',
  'Business/Financial',
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { loading, data, error, refetch } = useQuery(QUERY_USER_TUTORIALS);
  const [updateTutorial] = useMutation(UPDATE_TUTORIAL, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Update Tutorial Error:', error),
  });
  const [removeTutorial] = useMutation(REMOVE_TUTORIAL, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Remove Tutorial Error:', error),
  });
  const [removeVideoFromTutorial] = useMutation(REMOVE_VIDEO_FROM_TUTORIAL, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Remove Video Error:', error),
  });

  const [editFormState, setEditFormState] = useState({
    _id: '',
    title: '',
    content: '',
    category: '',
    videos: [],
  });

  const [expandedTutorialId, setExpandedTutorialId] = useState(null);

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormState({
      ...editFormState,
      [name]: value,
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateTutorial({
        variables: {
          id: editFormState._id,
          title: editFormState.title,
          content: editFormState.content,
          category: editFormState.category,
        },
      });
      setEditFormState({ _id: '', title: '', content: '', category: '', videos: [] });
    } catch (e) {
      console.error('Error during mutation:', e);
    }
  };

  const handleDelete = async (tutorialId) => {
    try {
      await removeTutorial({
        variables: { id: tutorialId },
      });
    } catch (e) {
      console.error('Error during mutation:', e);
    }
  };

  const handleDeleteVideo = async (tutorialId, videoId) => {
    try {
      await removeVideoFromTutorial({
        variables: { tutorialId, videoId },
      });
    } catch (e) {
      console.error('Error during mutation:', e);
    }
  };

  const toggleExpand = (tutorialId) => {
    setExpandedTutorialId(expandedTutorialId === tutorialId ? null : tutorialId);
  };

  const handleEditClick = (tutorial) => {
    setEditFormState({
      _id: tutorial._id,
      title: tutorial.title,
      content: tutorial.content,
      category: tutorial.category?.name || '',
      videos: tutorial.videos || [],
    });
  };

  const handleButtonClick = (buttonId) => {
    navigate('/categories/view-tutorial', { state: { clickButton: buttonId } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content text-center">
        <h1 className="dashboard-title">Dashboard</h1>
        <h2 className="dashboard-subtitle">Your Tutorials</h2>
        <div className="tutorials-list">
          {data.me && data.me.tutorials && data.me.tutorials.length > 0 ? (
            data.me.tutorials.map((tutorial) => (
              <div key={tutorial._id} className="tutorial-card card mt-5">
                <h3 className="tutorial-title">{tutorial.title}</h3>
                <div className="tutorial-content" style={{ whiteSpace: 'pre-wrap' }}>
                  {expandedTutorialId === tutorial._id ? tutorial.content : `${tutorial.content.substring(0, 300)}...`}
                </div>
                <p className="tutorial-category">Category: {tutorial.category?.name || 'No category'}</p>
                <Button
                  className="tutorialBtn"
                  style={{ marginLeft: '40%', marginRight: '40%', fontSize: '100px' }}
                  onClick={() => toggleExpand(tutorial._id)}
                >
                  <Card.Title style={{ fontSize: '16px' }}>
                    {expandedTutorialId === tutorial._id ? 'Collapse' : 'Expand'}
                  </Card.Title>
                </Button>

                <Button
                  className="tutorialBtn"
                  style={{ marginLeft: '40%', marginRight: '40%', fontSize: '100px' }}
                  onClick={() => handleButtonClick(tutorial._id)}
                >
                  <Card.Title style={{ fontSize: '16px' }}>View</Card.Title>
                </Button>

                <Button
                  className="tutorialBtn"
                  style={{ marginLeft: '40%', marginRight: '40%', fontSize: '100px' }}
                  onClick={() => handleEditClick(tutorial)}
                >
                  <Card.Title style={{ fontSize: '16px' }}>Edit</Card.Title>
                </Button>
                <Button
                  className="tutorialBtn"
                  style={{ color: 'red', marginLeft: '40%', marginRight: '40%', fontSize: '15px' }}
                  onClick={() => handleDelete(tutorial._id)}
                >
                  Delete
                </Button>
                {editFormState._id === tutorial._id && (
                  <form onSubmit={handleEditSubmit} className="edit-form">
                    <h3>Edit Tutorial</h3>
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <input
                        className="form-control"
                        id="title"
                        placeholder="Title"
                        name="title"
                        type="text"
                        value={editFormState.title}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="content">Content</label>
                      <textarea
                        className="form-control"
                        id="content"
                        placeholder="Content"
                        name="content"
                        rows="10"
                        value={editFormState.content}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="category">Category</label>
                      <select
                        className="form-control"
                        id="category"
                        name="category"
                        value={editFormState.category}
                        onChange={handleEditChange}
                      >
                        <option value="">Select a category</option>
                        {categoryList.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    {editFormState.videos.length > 0 && (
                      <div>
                        <h4>Videos:</h4>
                        {editFormState.videos.map((video) => (
                          <div key={video._id}>
                            <p>Title: {video.title}</p>
                            <div className="video-embed">
                              <iframe
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${video.videoId}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={video.title}
                              ></iframe>
                            </div>
                            <p>Thumbnail: <img src={video.thumbnail} alt="Thumbnail" /></p>
                            <button onClick={() => handleDeleteVideo(editFormState._id, video._id)}>Delete Video</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="btn-submit" type="submit">
                      Update Tutorial
                    </button>
                  </form>
                )}
              </div>
            ))
          ) : (
            <div>No tutorials available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
