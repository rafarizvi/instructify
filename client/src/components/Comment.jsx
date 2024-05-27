// Component for user when writing comments
import { useState } from'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TUTORIAL_COMMENTS } from '../../utils/queries';
import { ADD_COMMENT, REMOVE_COMMENT } from '../../utils/mutations';
// import {Link} from 'react-router-dom';
//  import Auth from '../../utils/auth';

// passing though tutorialId
const Comments = ({ tutorialId }) => {
  //using user from context.user for auth

  const { profileId } = profileId
  
  // Grabbing the query and the data. If data, query, will show, otherwise variable will be loading
  // applying variable to the tutorialId
  const { loading, data } = useQuery(
    GET_TUTORIAL_COMMENTS, {
    variables: { tutorialId } })
  
  // using state to take the written comment and set it to the empty array
  const [comment, setComment] = useState('')  

  // Mutation for adding a comment
  const [addComment] = useMutation(ADD_COMMENT)

  const addCommentForm = async (e) => {
    e.preventDefault();
    // adding the id of the tutorial and the comment
    // then asking db to refresh and pull all comments
    try {
      await addComment({
        variables: { tutorialId, content: comment },
        refetchQueries: 
        [{ query: GET_TUTORIAL_COMMENTS, 
          variables: { tutorialId } }]
      });

      //setting comment to empty array
      setComment('')
      
    } catch (err) {
      console.error('There was an error posting your comment. Please try again.');
    }
  }

  // Mutation for removing comment
  const [removeComment] = useMutation(REMOVE_COMMENT)

  // creating remove comment and passing it through as a variable and id
  // refetching all of the new data after comment is removed
  const removeCommentForm = async (commentId) => {

    try {
      await removeComment({
        variables: { id: commentId },
        refetchQueries: 
        [{ query: GET_TUTORIAL_COMMENTS, 
            variables: { tutorialId } }]
      });

    } catch (err) {
      console.error('There was an error removing your comment. Please try again.');
    }
  }

  if (loading) return <p>Loading user comments..</p>

  //
  return (
    <div>
      <h3>{ tutorialId }</h3>
      <ul>
        {data.comments.map((comment) => (
          <li key={comment._id}>
            {}
            <p>{comment.content} by {comment.author.name}</p>
            {comment.author._id === profileId._id && (
              <button onClick={() => removeCommentForm(comment._id)}>Delete</button>
            )}
          </li>
        ))}
      </ul>
      <form onSubmit={addCommentForm}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  )
}

export default Comments

