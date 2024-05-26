import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER_TUTORIALS } from '../utils/queries';
import { REMOVE_TUTORIAL, UPDATE_TUTORIAL } from '../utils/mutations';

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
        variables: { ...editFormState }
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
              <p className="tutorial-category">Category: {tutorial.category?.name || 'test'}</p>
              <button className="btn-edit" onClick={() => setEditFormState(tutorial)}>
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
