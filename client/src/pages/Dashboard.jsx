import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER_TUTORIALS } from '../utils/queries';
import { REMOVE_TUTORIAL, UPDATE_TUTORIAL } from '../utils/mutations';

import { Link } from 'react-router-dom'; // adding link to have user redirect to another page

const Dashboard = () => {
  const { loading, data, error, refetch } = useQuery(QUERY_USER_TUTORIALS);

  const [updateTutorial] = useMutation(UPDATE_TUTORIAL, {
    onCompleted: () => refetch(),
  });
  const [removeTutorial] = useMutation(REMOVE_TUTORIAL, {
    onCompleted: () => refetch(),
  });

  const [editFormState, setEditFormState] = useState({
    _id: '',
    title: '',
    content: '',
    category: ''
  });

  const handleEditChange = event => {
    const { name, value } = event.target;
    setEditFormState({
      ...editFormState,
      [name]: value
    });
  };

  const handleEditSubmit = async event => {
    event.preventDefault();
    try {
      await updateTutorial({
        // added to remove "object object" in text field
        variables: { ...editFormState, category: editFormState.category.name }
      });
      setEditFormState({ _id: '', title: '', content: '', category: '' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async tutorialId => {
    try {
      await removeTutorial({
        variables: { id: tutorialId }
      });
    } catch (e) {
      console.error(e);
    }
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
              <p className="tutorial-content">{tutorial.content}</p>
              <p className="tutorial-category">Category: {tutorial.category?.name || 'No category'}</p>
              {/* adding a button that links the user to render said tutorial by its ID so they can view comments. This will be boiler plate for all tutorials */}
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
                    <input
                      className="form-control"
                      id="category"
                      placeholder="Category"
                      name="category"
                      type="text"
                      value={editFormState.category}
                      onChange={handleEditChange}
                    />
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
