import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { ADD_TUTORIAL, REMOVE_TUTORIAL } from '../utils/mutations';
import { ALL_TUTORIALS, GET_CATEGORIES } from '../utils/queries';
import Auth from '../utils/auth';

const Tutorial = () => {
  // State for the form inputs
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    category: ''
  });

  // Query to fetch all tutorials
  const { loading: tutorialsLoading, data: tutorialsData, error: tutorialsError } = useQuery(ALL_TUTORIALS);
  // Query to fetch all categories
  const { loading: categoriesLoading, data: categoriesData, error: categoriesError } = useQuery(GET_CATEGORIES);

  // Mutation to add a tutorial
  const [addTutorial] = useMutation(ADD_TUTORIAL, {
    update(cache, { data: { addTutorial } }) {
      try {
        // Update the cache with the new tutorial
        const { tutorials } = cache.readQuery({ query: ALL_TUTORIALS });
        cache.writeQuery({
          query: ALL_TUTORIALS,
          data: { tutorials: [addTutorial, ...tutorials] }
        });
      } catch (e) {
        console.error(e);
      }
    }
  });

  // Mutation to remove a tutorial
  const [removeTutorial] = useMutation(REMOVE_TUTORIAL, {
    update(cache, { data: { removeTutorial } }) {
      try {
        // Update the cache by removing the deleted tutorial
        const { tutorials } = cache.readQuery({ query: ALL_TUTORIALS });
        cache.writeQuery({
          query: ALL_TUTORIALS,
          data: { tutorials: tutorials.filter(tutorial => tutorial._id !== removeTutorial._id) }
        });
      } catch (e) {
        console.error(e);
      }
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

  // Handle tutorial deletion
  const handleDelete = async tutorialId => {
    try {
      // Call the removeTutorial mutation with the tutorial ID
      await removeTutorial({
        variables: { _id: tutorialId }
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Show loading state if tutorials or categories are still loading
  if (tutorialsLoading || categoriesLoading) {
    return <div>Loading...</div>;
  }

  // Show error messages if there was an error fetching tutorials or categories
  if (tutorialsError) {
    return <div>Error: {tutorialsError.message}</div>;
  }

  if (categoriesError) {
    return <div>Error: {categoriesError.message}</div>;
  }

  return (
    <div>
      <h2>Manage Tutorials</h2>
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
      <div>
        {tutorialsData && tutorialsData.tutorials.map(tutorial => (
          <div key={tutorial._id}>
            <h3>{tutorial.title}</h3>
            <p>{tutorial.content}</p>
            <p>Category: {tutorial.category?.name || "Unknown"}</p>
            <button onClick={() => handleDelete(tutorial._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorial;
