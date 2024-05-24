import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TUTORIAL, REMOVE_TUTORIAL, ALL_TUTORIALS } from '../utils/mutations';
import Auth from '../utils/auth';

const Tutorial = () => {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    link: '',
    user: '',
  });

  const [showAlert, setShowAlert] = useState(false);

  const [addTutorial, { error: addError }] = useMutation(ADD_TUTORIAL, {
    update(cache, { data: { addTutorial } }) {
      try {
        const { tutorials } = cache.readQuery({ query: ALL_TUTORIALS });
        cache.writeQuery({
          query: ALL_TUTORIALS,
          data: { tutorials: [addTutorial, ...tutorials] },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const [removeTutorial, { error: removeError }] = useMutation(REMOVE_TUTORIAL, {
    update(cache, { data: { removeTutorial } }) {
      try {
        const { tutorials } = cache.readQuery({ query: ALL_TUTORIALS });
        cache.writeQuery({
          query: ALL_TUTORIALS,
          data: { tutorials: tutorials.filter((tutorial) => tutorial._id !== removeTutorial._id) },
        });
      } catch (e) {
        console.error(e);
      }
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        await addTutorial({
          variables: { ...formState },
        });
        setFormState({
          title: '',
          description: '',
          link: '',
          user: '',
        });
        window.location.assign('/dashboard');
      } catch (e) {
        console.error(e);
        setShowAlert(true);
      }
    }
  };

  return (
    <div>
      <h2>Add a Tutorial</h2>
      {showAlert && (
        <div className="alert alert-danger" role="alert">
          Something went wrong with your submission!
        </div>
      )}
      <form noValidate onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={formState.title}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Please provide a title.</div>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={formState.description}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Please provide a description.</div>
        </div>
        <div className="form-group">
          <label htmlFor="link">Link</label>
          <input
            type="text"
            className="form-control"
            id="link"
            name="link"
            value={formState.link}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">Please provide a link.</div>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      <h2>Remove a Tutorial</h2>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => removeTutorial({ variables: { id: formState.id } })}
      >
        Remove
      </button>

      {addError && <p>Error adding tutorial: {addError.message}</p>}
      {removeError && <p>Error removing tutorial: {removeError.message}</p>}
    </div>
  );
};

export default Tutorial;
