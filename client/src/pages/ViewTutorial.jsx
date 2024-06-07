import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import DateFormatTutorial from '../components/DateFormats/DateFormatTutorial';
import DateFormatComment from '../components/DateFormats/DateFormatComment';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import VideoCarousel from '../components/VideoCarousel/VideoCarousel';
import '../pages/viewTutorial.css';
import TutorialDisplay from '../components/TutorialDisplay/TutorialDisplay';
import { QUERY_TUTORIALS, QUERY_GET_TUTORIAL_LIKES_DISLIKES } from '../utils/queries';
import { ADD_COMMENT, REMOVE_COMMENT, LIKE_TUTORIAL, DISLIKE_TUTORIAL } from '../utils/mutations';
import Auth from '../utils/auth';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const ViewTutorial = () => {
  const location = useLocation();
  const { clickButton } = location.state || {};

  const { loading, data, error, refetch } = useQuery(QUERY_TUTORIALS, {
    fetchPolicy: 'network-only',
  });

  const { data: likesData, refetch: refetchLikesDislikes } = useQuery(QUERY_GET_TUTORIAL_LIKES_DISLIKES, {
    variables: { tutorialId: clickButton },
    fetchPolicy: 'network-only',
  });

  const [clickedTutorial, setClickedTutorial] = useState(null);
  const [likeTutorial] = useMutation(LIKE_TUTORIAL);
  const [dislikeTutorial] = useMutation(DISLIKE_TUTORIAL);

  useEffect(() => {
    if (!loading && data && clickButton) {
      const foundTutorial = data.tutorials.find((tutorial) => tutorial._id === clickButton);
      setClickedTutorial(foundTutorial);
    }
  }, [data, clickButton, loading, error]);

  useEffect(() => {
    if (likesData) {
      const { tutorial } = likesData;
      setCountUp(tutorial.likes.length);
      setCountDown(tutorial.dislikes.length);
    }
  }, [likesData]);

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

  const userThumbsUp = async () => {
    try {
      await likeTutorial({ variables: { tutorialId, profileId } });
      setCountUp((prevCountUp) => prevCountUp + 0);
      refetchLikesDislikes();
    } catch (error) {
      console.error('There was a query issue liking this tutorial', error);
    }
  };

  const userThumbsDown = async () => {
    try {
      await dislikeTutorial({ variables: { tutorialId, profileId } });
      setCountDown((prevCountDown) => prevCountDown + 0);
      refetchLikesDislikes();
    } catch (error) {
      console.error('There was a query issue disliking this tutorial', error);
    }
  };

  const [countUp, setCountUp] = useState(0);
  const [countDown, setCountDown] = useState(0);

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
          />
          <div>
            <Button className='thumbsUp' onClick={userThumbsUp}>
              <ThumbUpIcon />
              {countUp}
            </Button>
            <Button className='thumbsDown' onClick={userThumbsDown}>
              <ThumbDownIcon />
              {countDown}
            </Button>
          </div>
          <br />
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
                  You need to be logged in to add comments, like and dislike tutorials. Please{' '}
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
