import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import VideoCarousel from '../components/VideoCarousel';
import '../pages/viewTutorial.css';
import { QUERY_TUTORIALS } from '../utils/queries';
import { ADD_COMMENT, REMOVE_COMMENT } from '../utils/mutations';
import Auth from '../utils/auth';

const ViewTutorial = () => {
  const location = useLocation();
  const { clickButton } = location.state || {};
  const { loading, data, error, refetch } = useQuery(QUERY_TUTORIALS);
  const tutorials = data?.tutorials || [];

  const clickedTutorial = tutorials.find((tutorial) => tutorial._id === clickButton) || {};

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="tutorialDiv">
      {clickedTutorial && (
        <Card className="tutorialCard">
          <Card.Body>
            <h2 style={{ fontWeight: 'bold' }}>{clickedTutorial.title}</h2>
            <h5>By {clickedTutorial.author?.name}</h5>
            <span className="badge text-bg-info">{clickedTutorial.category?.name}</span>
            <div style={{ paddingTop: '5%' }}>
              <p style={{ fontSize: '18px', whiteSpace: 'pre-wrap' }}>{clickedTutorial.content}</p>
            </div>

            {clickedTutorial.videos && clickedTutorial.videos.length > 0 && (
              <VideoCarousel videos={clickedTutorial.videos} showDeleteButton={false} />
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
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default ViewTutorial;
