import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER_TUTORIALS } from '../utils/queries';
import { REMOVE_TUTORIAL, UPDATE_TUTORIAL } from '../utils/mutations';
import { Link } from 'react-router-dom'; // adding link to have user redirect to another page

const Dashboard = () => {
  // use apollo to fetch all tutorials by users
  const { loading, data, error, refetch } = useQuery(QUERY_USER_TUTORIALS);
  const [expandedTutorialId, setExpandedTutorialId] = useState(null);

  // use apollo to update an tutorial only by the author
  const [updateTutorial] = useMutation(UPDATE_TUTORIAL, {
    onCompleted: () => window.location.reload(), // Reload the page on completion
  });
  // using apollo to remove tutorials by the author
  const [removeTutorial] = useMutation(REMOVE_TUTORIAL, {
    onCompleted: () => refetch(),
  });

   // State for handling the edit form
  const [editFormState, setEditFormState] = useState({
    _id: '',
    title: '',
    content: '',
    category: ''
  });
  // Handle change in the edit form inputs
  const handleEditChange = event => {
    const { name, value } = event.target;
    setEditFormState({
      ...editFormState,
      [name]: value
    });
  };
   // Handle submission of the edit form
  const handleEditSubmit = async event => {
    event.preventDefault();
    try {
      await updateTutorial({
        variables: {
          id: editFormState._id,
          title: editFormState.title,
          content: editFormState.content,
          category: editFormState.category
        }
      });
      setEditFormState({ _id: '', title: '', content: '', category: '' });
    } catch (e) {
      console.error(e);
    }
  };
  // Handle deletion of a tutorial
  const handleDelete = async tutorialId => {
    try {
      await removeTutorial({
        variables: { id: tutorialId }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpand = tutorialId => {
    setExpandedTutorialId(expandedTutorialId === tutorialId ? null : tutorialId);
  };
  // show loading while the data is fetched
  if (loading) {
    return <div>Loading...</div>;
  }
  // show and error message if there is an error
  if (error) {
    return <div>Error: {error.message}</div>;
  }
   // Render the dashboard with tutorials
  return (
    <div className="dashboard-container">
      <div className="dashboard-content text-center">
        <h1 className="dashboard-title">Dashboard</h1>
        <h2 className="dashboard-subtitle">Your Tutorials</h2>
        <div className="tutorials-list">
          {data.me.tutorials.map((tutorial) => (
            <div key={tutorial._id} className="tutorial-card">
              <h3 className="tutorial-title">{tutorial.title}</h3>
              <p className="tutorial-content">
                {expandedTutorialId === tutorial._id ? tutorial.content : `${tutorial.content.substring(0, 500)}...`}
              </p>
              <p className="tutorial-category">Category: {tutorial.category?.name || 'No category'}</p>
              <Link to={`/tutorial/${tutorial._id}`} className="btn-view">View</Link>
              <button onClick={() => toggleExpand(tutorial._id)}>
                {expandedTutorialId === tutorial._id ? 'Collapse' : 'Expand'}
              </button>
              <button className="btn-edit" onClick={() => setEditFormState({
                _id: tutorial._id,
                title: tutorial.title,
                content: tutorial.content,
                category: tutorial.category ? tutorial.category.name : ''
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
                      required
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
                      required
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
                      required
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
