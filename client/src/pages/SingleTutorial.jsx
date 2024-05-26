import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useState } from 'react';
// Pulling in query that holds data for single tutorial and all of the comments and the associated category
import { QUERY_GET_TUTORIAL_DETAILS } from '../utils/queries';
// Bringing in add comment mutation
import { ADD_COMMENT, REMOVE_COMMENT } from '../utils/mutations';
import Auth from '../utils/auth'

// Pulling a single tutorial from the queries
const GetTutorial = () => {
  const { id } = useParams();
  const { loading, data, refetch } = useQuery(
    QUERY_GET_TUTORIAL_DETAILS, {
    variables: { tutorialId: id }
  });

  const profileId = Auth.getProfile().data._id;

  // adding mutation to add a comment
  // using useState to post comment and refetch to rerender new data
  const [comment, setComment] = useState('');
  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      setComment('');
      refetch()
    }
  })

  // adding remove comment mutation, once complete refetch new data
  const [removeComment] = useMutation(REMOVE_COMMENT, {
    onCompleted: () => {
      refetch();
    }
  })

  // adding submit form for adding the mutation add
  // using the tutorial id and the content to add comment
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
    try{
        await removeComment({
        variables: { id: commentId }

      })
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!data || !data.tutorial) return <div>No tutorial found</div>;

  const { 
    title, 
    content, 
    author, 
    comments, 
    category 
  } = data.tutorial;

  // Adding the ability to leave a comment which will show the users name, if there is no name the name 'guest' will be given to whoever write the comment. If the user id matches the user id who wrote the comment, the user will be able to delete the the comment. If the user does not own the comment, the delete button will not show
  return (
    <div className='text-center'>
      <h1>{title}</h1>
      <p>{content}</p>
      <p>By: {author.name}</p>
      <p>Category: {category.name}</p>
      <h4>Comments</h4>
        {comments.map(comment => (
          <p key={comment._id}>
            {/* a user should always be logged in, but a guest name will be given to those who are not */}
            {comment.content} by {comment.author ? comment.author.name : 'Guest'}
            {comment.author && comment.author._id === profileId && (
              <button onClick={() => handleRemoveComment(comment._id)}>Delete</button>
            )}
          </p>
        ))}
      <form onSubmit={handleCommentSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment"
          rows="4"
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        ></textarea>
        <button type="submit" style={{ padding: '10px 20px' }}>Submit</button>
      </form>
    </div>
  );
};

export default GetTutorial;