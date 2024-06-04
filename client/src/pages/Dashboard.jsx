import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { QUERY_USER_TUTORIALS } from '../utils/queries';
import { REMOVE_TUTORIAL, UPDATE_TUTORIAL, REMOVE_VIDEO_FROM_TUTORIAL } from '../utils/mutations';
import ConfirmDelete from '../components/ConfirmDelete';
import DateFormatTutorial from '../components/DateFormats/DateFormatTutorial';
import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import '../components/createTutorial/Tutorial.css';
import './dashboard.css';
const categoryList = [
  'Tech', 'Academics', 'Home', 'Arts', 'Lifestyle/Hobbies', 'Business/Financial',
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
    _id: '', title: '', content: '', category: '', videos: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState(null);
  const handleEditChange = (name, value) => {
    setEditFormState({ ...editFormState, [name]: value });
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
  const handleDelete = async () => {
    if (tutorialToDelete) {
      try {
        await removeTutorial({ variables: { id: tutorialToDelete } });
        setShowModal(false);
        setTutorialToDelete(null);
      } catch (e) {
        console.error('Error during mutation:', e);
      }
    }
  };
  const handleDeleteClick = (tutorialId) => {
    setShowModal(true);
    setTutorialToDelete(tutorialId);
  };
  const handleDeleteVideo = async (tutorialId, videoId) => {
    try {
      await removeVideoFromTutorial({ variables: { tutorialId, videoId } });
      setEditFormState((prevState) => ({
        ...prevState,
        videos: prevState.videos.filter((video) => video._id !== videoId),
      }));
    } catch (e) {
      console.error('Error during mutation:', e);
    }
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
  const handleCreateClick = () => {
    navigate('/tutorial')
  }
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title text-center">Dashboard</h1>
        <h2 className="dashboard-subtitle text-center">Your Tutorials</h2>
        <div className="tutorials-list">
          {data.me && data.me.tutorials && data.me.tutorials.length > 0 ? (
            data.me.tutorials.map((tutorial) => (
              <div key={tutorial._id} className="tutorial-card card mt-5" style={{ backgroundColor: 'transparent', borderColor: '#2171E5', borderWidth: '1px', borderRadius: '30px' }}>
                <h3 className="tutorial-title text-center">{tutorial.title}</h3>
                <div className="d-flex justify-content-center">
                  <p className="tutorial-category mt-4 badge text-bg-info" style={{ fontSize: '20px' }}>{tutorial.category?.name}</p>
                </div>
                <br />
                <DateFormatTutorial createdAt={tutorial.createdAt} />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button className="tutorialBtnDashboard tutorialBtn "
                  style={{ width: '200px' }}
                  onClick={() => handleButtonClick(tutorial._id)}>
                    <Card.Title style={{ fontSize: '16px' }}>View</Card.Title>
                  </Button>
                  <Button className="tutorialBtnDashboard tutorialBtn "
                  style={{ width: '200px' }}
                  onClick={() => handleEditClick(tutorial)}>
                    <Card.Title style={{ fontSize: '16px' }}>Edit</Card.Title>
                  </Button>
                  <Button className="tutorialBtnDashboard tutorialBtn "
                  style={{ color: 'red', width: '200px' }}
                  onClick={() => handleDeleteClick(tutorial._id)}>
                    Delete
                  </Button>
                </div>
                {editFormState._id === tutorial._id && (
                  <form onSubmit={handleEditSubmit} className="edit-form">
                    <h3>Edit Tutorial</h3>
                    <div className="form-group">
                      <label htmlFor="title">Title</label>
                      <input className="form-control"
                      id="title" placeholder="Title"
                      name="title" type="text"
                      value={editFormState.title}
                      onChange={(e) => handleEditChange(e.target.name, e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label htmlFor="content">Content</label>
                      <ReactQuill
                        theme="snow"
                        value={editFormState.content}
                        onChange={(value) => handleEditChange('content', value)}
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            [{ font: [] }],
                            [{ color: [] }, { background: [] }],
                            ['bold', 'italic', 'underline'],
                            [{ list: 'ordered' }, { list: 'bullet' }],
                            ['code-block'],
                            ['link'],
                          ],
                        }}
                        formats={[
                          'header', 'font', 'color', 'background',
                          'bold', 'italic', 'underline',
                          'list', 'bullet',
                          'link',
                          'code-block',
                        ]}
                        placeholder="Edit your tutorial content here"
                        className="react-quill"
                      />
                    </div>
                    <div className="form-group">
                      <select className="form-control" id="category" name="category" value={editFormState.category} onChange={(e) => handleEditChange(e.target.name, e.target.value)}>
                      <label htmlFor="category">Category</label>
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
                            <div key={video._id} className="col-md-4 mb-3 position-relative">
                              <p>Title: {video.title}</p>
                              <div className="video-embed mb-4 position-relative">
                                <iframe
                                  width="100%"
                                  height="200"
                                  src={`https://www.youtube.com/embed/${video.videoId}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  title={video.title}
                                ></iframe>
                                <Button
                                  variant="link"
                                  className="btn btn-primary position-relative position-absolute top-15 start-75 translate-middle badge rounded-circle bg-danger large-delete-btn"
                                  onClick={() => handleDeleteVideo(editFormState._id, video._id)}
                                >
                                  <FontAwesomeIcon icon={faTimes} />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                    <button className="tutorialBtnDashboard tutorialBtn" type="submit">
                      Update Tutorial
                    </button>
                  </form>
                )}
              </div>
            ))
          ) : (
            <div className="no-tutorials text-center m-5">
              <p>Looks like you do not have any tutorials yet! Why don't you share what you know?</p>
              <Button onClick={handleCreateClick} className="createTutorialBtn">Create a Tutorial</Button>
            </div>
          )}
        </div>
      </div>
      <ConfirmDelete show={showModal} handleClose={() => setShowModal(false)} handleDelete={handleDelete} />
    </div>
  );
};
export default Dashboard;