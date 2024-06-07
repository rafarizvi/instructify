import 'react-quill/dist/quill.snow.css';
import './assets/createTutorial.css';
import 'highlight.js/styles/atom-one-dark.css';

import {
  useState,
  useEffect,
  useMutation,
  useNavigate,
  ADD_TUTORIAL,
  QUERY_USER_TUTORIALS,
  AuthService,
  ReactQuill,
  WordCount,
  hljs
} from './index'

const categories = [
  'Tech',
  'Academics',
  'Home',
  'Arts',
  'Lifestyle/Hobbies',
  'Business/Financial',
];

const modules = {
  syntax: true,
  toolbar: [
    [{ header: [1, 2, false] }],
    [{ font: [] }],
    [{ color: [] }, { background: [] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['code-block'],
    ['link'],
  ],
};

const formats = [
  'header', 'font', 'color', 'background',
  'bold', 'italic', 'underline',
  'list', 'bullet',
  'link',
  'code-block'
];

const CreateTutorial = () => {
  const [formState, setFormState] = useState({
    title: '',
    content: '',
    category: '',
  });

  // added usestate for tutorial 
  const [minimumContent, setMinimumContent] = useState('');
  const [maxContent, setMaxContent] = useState('');
  const [minimumTitle, setMinimumTitle] = useState('');
  const [missingFields, setMissingFields] = useState('');

  const navigate = useNavigate();

  const [addTutorial, { error }] = useMutation(ADD_TUTORIAL, {
    context: {
      headers: {
        authorization: `Bearer ${AuthService.getToken()}`,
      },
    },
    onCompleted: () => {
      navigate('/dashboard');
    },
    refetchQueries: [{ query: QUERY_USER_TUTORIALS }],
  });

  const handleChange = (name, value) => {
    setFormState({
      ...formState,
      [name]: value,
    });

    setMissingFields('');
    setMinimumContent('');
    setMaxContent('');
    setMinimumTitle('');
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (formState.content.length < 500) {
      setMinimumContent('The tutorial content must be at least 500 characters long.');
      return;
    }

    if (formState.content.split(' ').length > 2000) {
      setMaxContent('You have exceeded the amount of words.');
      return;
    }

    if (formState.title.length > 30) {
      setMinimumTitle('Your title is too long. Max 30 characters.');
      return;
    }

    if (!formState.value) {
      setMissingFields('Please fill out all fields.');
      console.log(formState.value);
    }

    try {
      await addTutorial({
        variables: {
          title: formState.title,
          content: formState.content,
          category: formState.category,
        },
      });

      setFormState({
        title: '',
        content: '',
        category: '',
      });
    } catch (e) {
      console.error(e);
    }
  };

  // For ReactQuill JavaScript code highlighting using code block
  useEffect(() => {
    hljs.highlightAll();
  }, [formState.content]);

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
              placeholder="Share what you know!"
              className="react-quill"
            />
            <p><WordCount content={formState.content} style={{ fontSize: '15px' }} />
            </p>
          </div>
          <div className="form-group">
            <select
              className="form-input"
              name="category"
              value={formState.category}
              onChange={(e) => handleChange('category', e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          {minimumContent && (
            <p className="minimumMessage" style={{ color: 'red', fontSize: '15px' }}>
              {minimumContent}
            </p>
          )}
          {minimumTitle && (
            <p className="minimumMessage" style={{ color: 'red', fontSize: '15px' }}>
              {minimumTitle}
            </p>
          )}
          {maxContent && (
            <p className="minimumMessage" style={{ color: 'red', fontSize: '15px' }}>
              {maxContent}
            </p>
          )}
          {missingFields && (
            <p className="minimumMessage" style={{ color: 'red', fontSize: '15px' }}>
              {missingFields}
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

export default CreateTutorial;
