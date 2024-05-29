import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
// Pulling in query that holds data for single tutorial and all of the comments and the associated category
import { useQuery, useMutation } from '@apollo/client';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { QUERY_GET_TUTORIAL_DETAILS } from '../utils/queries';
// Bringing in add comment mutation
import { ADD_COMMENT, REMOVE_COMMENT } from '../utils/mutations';
import Auth from '../utils/auth';
import '../pages/viewTutorial.css';

// Pulling a single tutorial from the queries
const GetTutorial = () => {
  const { id } = useParams();
  const { loading, data, refetch } = useQuery(QUERY_GET_TUTORIAL_DETAILS, {
    variables: { tutorialId: id }
  });

  const profileId = Auth.getProfile().data._id;

  // / adding mutation to add a comment
  // using useState to post comment and refetch to rerender new data
  const [comment, setComment] = useState('');
  const [addComment, { error }] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setComment('');
      refetch();
    },
    onError: (error) => console.error('Add comment Error:', error),
  });
  
  // adding remove comment mutation, once complete refetch new data
  const [removeComment] = useMutation(REMOVE_COMMENT, {
    onCompleted: () => {
      refetch();
    },
    // adding additional error handeling for removing comment
    onError: console.error('Whoops, there was a problem removing your comment. Please try again.'),
  });

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await addComment({
        variables: { profileId, tutorialId: id, content: comment }
      });
    } catch (error) {
      console.error(error);
    }
  };

    // handling delete button for user, using the comment id only for removal
  const handleRemoveComment = async (commentId) => {
    try {
      await removeComment({
        variables: { id: commentId }
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!data || !data.tutorial) return <div>No tutorial found</div>;

  const { title, content, author, comments, category } = data.tutorial;

  
  //Refactored viewing and commenting via dashboard. Added syntax which is identical to ViewTutorial, to keep the application structured
  return (
    <>
      <div className="tutorialDiv .singleTutorial">
        <Card className="tutorialCard .singleTutorial">
          <Card.Body>
            <h2 style={{ fontWeight: 'bold' }}>{title}</h2>
            <h5>By {author.name}</h5>
            <span className="badge text-bg-info">{category.name}</span>
            <div style={{ paddingTop: '5%' }}>
              <p style={{ fontSize: '18px', whiteSpace: 'pre-wrap'  }}>{content}</p>
            </div>

            <div className="commentDiv">
              <div>
                <h4>Add your comment</h4>
                {Auth.loggedIn() ? (
                  <Form onSubmit={handleCommentSubmit}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Leave a comment"
                        style={{ border: 'solid 1.5px black', marginBottom: '10px' }}
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
              {comments.map(comment => (
                <div key={comment._id}>
                  <span className="badge text-bg-secondary">{comment.author ? comment.author.name : 'Guest'}</span>
                  {comment.author && comment.author._id === profileId && (
                    <button className="badge text-bg-danger" style={{ marginLeft: '5px' }}
                      onClick={() => handleRemoveComment(comment._id)}>Delete</button>
                  )}
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default GetTutorial;
