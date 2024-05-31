import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ADD_TUTORIAL } from '../../utils/mutations';
import { GET_CATEGORIES, QUERY_USER_TUTORIALS } from '../../utils/queries';
import AuthService from '../../utils/auth';
import './Tutorial.css';

const Tutorial = () => {
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    category: ''
  });

  // Adding useState for on-screen error message
  const [minimumContent, SetMinimumContent] = useState('')

  const navigate = useNavigate();

  const { loading: categoriesLoading, data: categoriesData, error: categoriesError } = useQuery(GET_CATEGORIES);

  const [addTutorial, { error }] = useMutation(ADD_TUTORIAL, {
    context: {
      headers: {
        authorization: `Bearer ${AuthService.getToken()}`
      }
    },
    onCompleted: () => {
      navigate('/dashboard');
    },
    refetchQueries: [{ query: QUERY_USER_TUTORIALS }]
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value
    });

    // useState empty array that will be filled if the user does not meet criteria
    SetMinimumContent('')
  };

  const handleFormSubmit = async event => {
    event.preventDefault();

    // User must meet the minimum length otherwise can't post
    // Using the trim method to determine characters, not words
    if ((formState.content.trim().length) < 300) {
      SetMinimumContent('The tutorial content must be at least 300 characters long.');
      return;
    }

    try {
      await addTutorial({
        variables: { 
          title: formState.title,
          content: formState.content,
          category: formState.category
        }
      });

      setFormState({
        title: '',
        content: '',
        category: ''
      });
    } catch (e) {
      console.error(e);
    }
  };

  if (categoriesLoading) {
    return <div>Loading...</div>;
  }

  if (categoriesError) {
    return <div>Error: {categoriesError.message}</div>;
  }

  return (
    <div className="page-container">
      <div className="add-tutorial-container">
        <h2 className="form-title with-margin">Create Tutorial</h2>
        <form onSubmit={handleFormSubmit} className="form-container no-margin-top">
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Title"
              name="title"
              type="text"
              value={formState.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-input"
              placeholder="Write your tutorial! Your tutorial must be a minimum of 300 characters."
              name="content"
              rows="9"
              value={formState.content}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <select
              className="form-input"
              name="category"
              value={formState.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categoriesData.categories.map(category => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          {minimumContent && (
            <p className="minimumMessage" style={{ color: 'red' }}>
              {minimumContent}
            </p>
          )}
          <button className="tutorialBtn" style={{ color: 'white', marginLeft: '40%', marginRight: '40%', fontSize: '17px' }} type="submit">
            Create
          </button>
        </form>
        {error && <p className="error-message">Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default Tutorial;
