import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import DateFormatTutorial from '../components/DateFormats/DateFormatTutorial';
import DateFormatComment from '../components/DateFormats/DateFormatComment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import VideoCarousel from '../components/VideoCarousel';
import '../pages/viewTutorial.css';
import TutorialDisplay from '../components/tutorialDisplay/TutorialDisplay';
import { QUERY_TUTORIALS } from '../utils/queries';
import { ADD_COMMENT, REMOVE_COMMENT } from '../utils/mutations';
import Auth from '../utils/auth';

const ViewTutorial = () => {
  const location = useLocation();
  const { clickButton } = location.state || {};
  
  //using code to refetch data before defining it. Name for tutorials were being defined before being read which led to errors- so this will ensure data is loaded before rendering data
  const { loading, data, error, refetch } = useQuery(QUERY_TUTORIALS, {
    fetchPolicy: 'network-only', 
  });
  const [clickedTutorial, setClickedTutorial] = useState(null);

  useEffect(() => {
    if (!loading && data && clickButton) {
      // console.log("Tutorial IDs in data:", data.tutorials.map(tutorial => tutorial._id));
      const foundTutorial = data.tutorials.find((tutorial) => tutorial._id === clickButton);
      setClickedTutorial(foundTutorial);
    }
  }, [data, clickButton, loading, error]);

  const profileId = Auth.loggedIn() ? Auth.getProfile().data._id : null;
  const tutorialId = clickButton;

  const [content, setContent] = useState('');
  const [addContent] = useMutation(ADD_COMMENT, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Add comment Error:', error),
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      await addContent({
        variables: { profileId, tutorialId, content },
      });

      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  const [removeComment] = useMutation(REMOVE_COMMENT, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Remove comment Error:', error),
  });

  const deleteComment = async (commentId) => {
    try {
      await removeComment({
        variables: { id: commentId },
      });
    } catch (e) {
      console.error('Error during mutation:', e);
    }
  };
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!clickedTutorial) {
    return <div className='text-center'>Loading tutorial details...</div>;
  }





  

  return (
    <div className="tutorialDiv">
      <Card className="tutorialCard">
        <Card.Body>
          <TutorialDisplay
            title={clickedTutorial.title}
            content={clickedTutorial.content}
            author={clickedTutorial.author}
            category={clickedTutorial.category}
            images={clickedTutorial.images}
            />
          <DateFormatTutorial createdAt={clickedTutorial.createdAt} />

          {clickedTutorial.videos && clickedTutorial.videos.length > 0 && (
            <VideoCarousel videos={clickedTutorial.videos} />
          )}

          <div className="commentDiv">
            <div>
              <h4>Add your comment</h4>
              {Auth.loggedIn() ? (
                <Form onSubmit={handleFormSubmit}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control
                      style={{ border: 'solid 1.5px black', marginBottom: '10px' }}
                      as="textarea"
                      rows={3}
                      placeholder="Type here..."
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                    />
                    <div className="col-6 col-sm-3">
                      <button className="btn btn-info" type="submit">
                        Submit
                      </button>
                    </div>
                    {error && (
                      <div className="col-12 my-3 bg-danger text-white p-3">
                        {error.message}
                      </div>
                    )}
                  </Form.Group>
                </Form>
              ) : (
                <p>
                  You need to be logged in to add comments. Please{' '}
                  <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
                </p>
              )}
            </div>

            <h4 style={{ fontWeight: 'bold', paddingBottom: '10px' }}>Comments</h4>
            {clickedTutorial.comments && clickedTutorial.comments.map((comment) => (
              <div key={comment._id}>
                <span className="badge text-bg-secondary">{comment.author.name}</span>
                {comment.author._id === profileId && (
                  <button className="badge text-bg-danger" style={{ marginLeft: '5px' }} onClick={() => deleteComment(comment._id)}>
                    Delete
                  </button>
                )}
                <p>{comment.content}
                  <br />
                  <DateFormatComment createdAt={comment.createdAt} /> </p>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewTutorial;