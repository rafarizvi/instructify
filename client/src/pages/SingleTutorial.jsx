    import { useParams } from 'react-router-dom';
    import { useQuery } from '@apollo/client';
    // Pulling in query that holds data for single tutorial and all of the comments and the associated category
    import { QUERY_GET_TUTORIAL_DETAILS } from '../utils/queries';
    
    const GetTutorial = () => {
      const { id } = useParams();
      const { loading, data } = useQuery(
        QUERY_GET_TUTORIAL_DETAILS, {
        variables: { tutorialId: id }
      });
    
      
      const { 
        title, 
        content, 
        author, 
        comments, 
        category } = data.tutorial;
      
      if (loading) return <div>Loading...</div>

      return (
        <div className='text-center'>
          <h1>{title}</h1>
          <p>{content}</p>
          <p>By: {author.name}</p>
          <p>Category: {category.name}</p>
          <h4>Comments</h4>
          <ul>
            {comments.map(comment => (
              <li key={comment._id}>{comment.content} by {comment.author.name}</li>
            ))}
          </ul>
        </div>
      );
    };
    
    export default GetTutorial
    