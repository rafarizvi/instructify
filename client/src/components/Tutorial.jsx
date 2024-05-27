import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ADD_TUTORIAL } from '../utils/mutations';
import { GET_CATEGORIES } from '../utils/queries';
import AuthService from '../utils/auth';

const Tutorial = () => {
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    category: ''
  });

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
    }
  });

  const handleChange = event => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };

  const handleFormSubmit = async event => {
    event.preventDefault();
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
    <div className="add-tutorial-container text-center">
      <h2 className="text-center">Add Tutorial</h2>
      <form onSubmit={handleFormSubmit} className="form-container">
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
            placeholder="Content"
            name="content"
            rows="10"
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
        <button className="btn-submit" type="submit">
          Add Tutorial
        </button>
      </form>
      {error && <p className="error-message">Error: {error.message}</p>}
    </div>
  );
};

export default Tutorial;
