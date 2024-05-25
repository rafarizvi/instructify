import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ADD_TUTORIAL } from '../utils/mutations';
import { GET_CATEGORIES } from '../utils/queries';

const Tutorial = () => {
  // State for the form inputs
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    category: ''
  });

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Query to fetch all categories
  const { loading: categoriesLoading, data: categoriesData, error: categoriesError } = useQuery(GET_CATEGORIES);

  // Mutation to add a tutorial
  const [addTutorial, { error: addTutorialError }] = useMutation(ADD_TUTORIAL, {
    onCompleted: () => {
      // Redirect to Dashboard after successful submission
      navigate('/dashboard');
    }
  });

  // Handle form input changes
  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  // Handle form submission to add a new tutorial
  const handleFormSubmit = async event => {
    event.preventDefault();
    try {
      // Call the addTutorial mutation with the form state
      await addTutorial({
        variables: { ...formState }
      });

      // Reset form state after submission
      setFormState({
        title: '',
        content: '',
        category: ''
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Show loading state if categories are still loading
  if (categoriesLoading) {
    return <div>Loading...</div>;
  }

  // Show error messages if there was an error fetching categories
  if (categoriesError) {
    return <div>Error: {categoriesError.message}</div>;
  }

  return (
    <div>
      <h2>Add Tutorial</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          className="form-input"
          placeholder="Title"
          name="title"
          type="text"
          value={formState.title}
          onChange={handleChange}
        />
        <input
          className="form-input"
          placeholder="Content"
          name="content"
          type="text"
          value={formState.content}
          onChange={handleChange}
        />
        <select
          className="form-input"
          name="category"
          value={formState.category}
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          {categoriesData.categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <button className="btn btn-block btn-info" style={{ cursor: 'pointer' }} type="submit">
          Add Tutorial
        </button>
      </form>
      {addTutorialError && <p>Error: {addTutorialError.message}</p>}
    </div>
  );
};

export default Tutorial;
