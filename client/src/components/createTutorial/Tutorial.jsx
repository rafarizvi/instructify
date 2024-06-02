import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { ADD_TUTORIAL } from '../../utils/mutations';
import { QUERY_USER_TUTORIALS } from '../../utils/queries';
import AuthService from '../../utils/auth';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Tutorial.css';


const categories =
  [
    'Tech',
    'Academics',
    'Home',
    'Arts',
    'Lifestyle/Hobbies',
    'Business/Financial'
  ]


const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    [{ font: [] }],
    [{ color: [] }, { background: [] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['code-block'],
    ['link'],
  ]
};

const formats = [
  'header', 'font', 'color', 'background',
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'link',
  'code-block'
];


const Tutorial = () => {
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    category: ''
  });

  const [minimumContent, setMinimumContent] = useState('');

  const navigate = useNavigate();

  // const { loading: categoriesLoading, data: categoriesData, error: categoriesError } = useQuery(GET_CATEGORIES);

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

  const handleChange = (name, value) => {
    setFormState({
      ...formState,
      [name]: value
    });

    setMinimumContent('');
  };

  const handleFormSubmit = async event => {
    event.preventDefault();

    if ((formState.content.length) < 300) {
      setMinimumContent('The tutorial content must be at least 300 characters long.');
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

  // if (categoriesLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (categoriesError) {
  //   return <div>Error: {categoriesError.message}</div>;
  // }

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
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          <div className="form-group">
            <ReactQuill
              theme="snow"
              value={formState.content}
              onChange={(value) => handleChange('content', value)}
              modules={modules}
              formats={formats}
              placeholder="Write your tutorial! Your tutorial must be a minimum of 300 characters."
              className="react-quill"
            />
          </div>
          <div className="form-group">
            <select
              className="form-input"
              name="category"
              value={formState.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">Select a category</option>
              <option value={categories[0]}>{categories[0]}</option>
              <option value={categories[1]}>{categories[1]}</option>
              <option value={categories[2]}>{categories[2]}</option>
              <option value={categories[3]}>{categories[3]}</option>
              <option value={categories[4]}>{categories[4]}</option>
              <option value={categories[5]}>{categories[5]}</option>
            </select>
          </div>
          {minimumContent && (
            <p className="minimumMessage" style={{ color: 'red' }}>
              {minimumContent}
            </p>
          )}
          <button className="tutorialBtn" style={{ color: 'white' }} type="submit">
            Create
          </button>
        </form>
        {error && <p className="error-message">Error: {error.message}</p>}
      </div>
    </div>
  );
};

export default Tutorial;
