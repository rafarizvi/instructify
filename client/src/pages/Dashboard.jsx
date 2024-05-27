import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER_TUTORIALS } from '../utils/queries';
import { REMOVE_TUTORIAL, UPDATE_TUTORIAL } from '../utils/mutations';
import { Link } from 'react-router-dom'; // adding link to have user redirect to another page

// addding categories that can be used via dropdown for user
const categoryList = [
  'Tech',
  'Academics',
  'Home',
  'Arts',
  'Lifestyle/Hobbies',
  'Business/Financial',
];

const Dashboard = () => {
  const { loading, data, error, refetch } = useQuery(QUERY_USER_TUTORIALS);
  const [updateTutorial] = useMutation(UPDATE_TUTORIAL, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Update Tutorial Error:', error),
  });
  const [removeTutorial] = useMutation(REMOVE_TUTORIAL, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Remove Tutorial Error:', error),
  });

  const [editFormState, setEditFormState] = useState({
    _id: '',
    title: '',
    content: '',
    category: ''
  });

  const [expandedTutorialId, setExpandedTutorialId] = useState(null);

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormState({
      ...editFormState,
      [name]: value
    });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    console.log('Submitting edit form with state:', editFormState);
    try {
      await updateTutorial({
        variables: {
          id: editFormState._id,
          title: editFormState.title,
          content: editFormState.content,
          category: editFormState.category,
        },
      });
      setEditFormState({ _id: '', title: '', content: '', category: '' });
    } catch (e) {
      console.error('Error during mutation:', e);
    }
  };

  const handleDelete = async (tutorialId) => {
    try {
      await removeTutorial({
        variables: { id: tutorialId }
      });
    } catch (e) {
      console.error('Error during mutation:', e);
    }
  };

  const toggleExpand = (tutorialId) => {
    setExpandedTutorialId(expandedTutorialId === tutorialId ? null : tutorialId);
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
          {data.me.tutorials.map((tutorial) => (
            <div key={tutorial._id} className="tutorial-card">
              <h3 className="tutorial-title">{tutorial.title}</h3>
              <div className="tutorial-content" style={{ whiteSpace: 'pre-wrap' }}>
                {expandedTutorialId === tutorial._id ? tutorial.content : `${tutorial.content.substring(0, 100)}...`}
              </div>
              <p className="tutorial-category">Category: {tutorial.category?.name || 'No category'}</p>
              <button onClick={() => toggleExpand(tutorial._id)}>
                {expandedTutorialId === tutorial._id ? 'Collapse' : 'Expand'}
              </button>
              <Link to={`/tutorial/${tutorial._id}`} className="btn-view">View</Link>
              <button className="btn-edit" onClick={() => setEditFormState({
                _id: tutorial._id,
                title: tutorial.title,
                content: tutorial.content,
                category: tutorial.category.name
              })}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(tutorial._id)}>
                Delete
              </button>
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
                  <button className="btn-submit" type="submit">
                    Update Tutorial
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
