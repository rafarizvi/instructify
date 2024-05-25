import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_TUTORIALS, GET_CATEGORIES } from '../utils/queries';
import { REMOVE_TUTORIAL, UPDATE_TUTORIAL } from '../utils/mutations';

const Dashboard = () => {
  const { loading, data, error, refetch } = useQuery(ALL_TUTORIALS);

  const [updateTutorial] = useMutation(UPDATE_TUTORIAL, {
    onCompleted: () => refetch() // Refetch the data after an update
  });

  const [removeTutorial] = useMutation(REMOVE_TUTORIAL, {
    onCompleted: () => refetch() // Refetch the data after a deletion
  });

  const [editFormState, setEditFormState] = useState({
    _id: '',
    title: '',
    content: '',
    category: ''
  });

  // Trigger refetch on component mount to ensure fresh data
  useEffect(() => {
    refetch();
  }, []);

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
        variables: { _id: tutorialId }
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
    <div>
      <h1>Dashboard</h1>

      <h2>All Tutorials</h2>
      <div>
        {data.tutorials.map(tutorial => (
          <div key={tutorial._id}>
            <h3>{tutorial.title}</h3>
            <p>{tutorial.content}</p>
            <p>Category: {tutorial.category?.name || 'Unknown'}</p>
            <button onClick={() => setEditFormState(tutorial)}>Edit</button>
            <button onClick={() => handleDelete(tutorial._id)}>Delete</button>
          </div>
        ))}
      </div>

      {editFormState._id && (
        <form onSubmit={handleEditSubmit}>
          <h3>Edit Tutorial</h3>
          <input
            className="form-input"
            placeholder="Title"
            name="title"
            type="text"
            value={editFormState.title}
            onChange={handleEditChange}
          />
          <input
            className="form-input"
            placeholder="Content"
            name="content"
            type="text"
            value={editFormState.content}
            onChange={handleEditChange}
          />
          <select
            className="form-input"
            name="category"
            value={editFormState.category}
            onChange={handleEditChange}
          >
            <option value="">Select a category</option>
            {data.tutorials.map(tutorial => (
              <option key={tutorial.category._id} value={tutorial.category._id}>
                {tutorial.category.name}
              </option>
            ))}
          </select>
          <button className="btn btn-block btn-info" style={{ cursor: 'pointer' }} type="submit">
            Update Tutorial
          </button>
        </form>
      )}
    </div>
  );
};

export default Dashboard;
