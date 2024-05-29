import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import '../pages/viewTutorial.css'

import { QUERY_TUTORIALS } from '../utils/queries';
import { ADD_COMMENT } from '../utils/mutations';
import { REMOVE_COMMENT } from '../utils/mutations';

import Auth from '../utils/auth';


const ViewTutorial = () => {
  const location = useLocation();
  const { clickButton } = location.state || {};
  const { loading, data, error, refetch } = useQuery(QUERY_TUTORIALS);
  const tutorials = data?.tutorials || [];

  const clickedTutorial = [];
  tutorials.map((tutorial) => {
    if (tutorial._id === clickButton) {
      clickedTutorial.push(tutorial);
    }
  });

  // Handle adding comments
  const profileId = Auth.loggedIn() ? Auth.getProfile().data._id : null;
  const tutorialId = clickButton;

  const [content, setContent] = useState('');
  const [addcontent] = useMutation(ADD_COMMENT, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Add comment Error:', error),
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(clickedTutorial);

    try {
      const data = await addcontent({
        variables: { profileId, tutorialId, content },
      });

      setContent('');
    } catch (err) {
      console.error(err);
    }
  }


  // Handle removing comment
  const [removeComment] = useMutation(REMOVE_COMMENT, {
    onCompleted: () => refetch(),
    onError: (error) => console.error('Remove comment Error:', error),
  });
  const deleteComment = async (commentId) => {
    console.log(clickedTutorial);
    console.log(clickButton);
    try {
      await removeComment({
        variables: { id: commentId }
      });
    } catch (e) {
      console.error('Error during mutation:', e);
    }
  };

  return (
    <>
      <div className='tutorialDiv'>
        {clickedTutorial &&
          clickedTutorial.map((clickedTutorial) => (
            <div key={clickedTutorial._id}>

              <Card className='tutorialCard'>
                <Card.Body>
                  <h2 style={{ 'fontWeight': 'bold' }}>{clickedTutorial.title}</h2>
                  <h5>By {clickedTutorial.author.name}</h5>
                  <span className="badge text-bg-info">{clickedTutorial.category.name}</span>
                  <div style={{ 'paddingTop': '5%' }}>
                    <p style={{ 'fontSize': '18px' }}>{clickedTutorial.content} Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora neque quam aliquam maxime atque officiis vel. Hic deleniti quibusdam culpa quidem velit sapiente, error aliquam asperiores inventore ducimus eum non!</p>
                  </div>

                  <div className='commentDiv'>
                    <div>
                      <h4>Add your comment</h4>
                      {Auth.loggedIn() ? (

                        // className="flex-row justify-center justify-space-between-md align-center"


                        <Form onSubmit={handleFormSubmit}
                          placeholder="Type here..."
                          type='text'
                          value={content}
                          className="form-input w-100"
                          onChange={(event) => setContent(event.target.value)}
                        >
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Control style={{ 'border': 'solid 1.5px black', 'marginBottom': '10px' }} as="textarea" rows={3} placeholder="Type here..." />
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

                    <h4 style={{ 'fontWeight': 'bold', 'paddingBottom': '10px' }}>Comments</h4>
                    {clickedTutorial.comments && clickedTutorial.comments.map((comments) => (
                      <div key={comments._id}>
                        <span className="badge text-bg-secondary">{comments.author.name}</span>

                        {comments.author._id === profileId && (
                          <button className="badge text-bg-danger" style={{'marginLeft':'5px'}}
                            onClick={() => deleteComment(comments._id)}>Delete</button>
                        )}

                        <p>{comments.content}</p>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
      </div>

    </>
  );
};

export default ViewTutorial;
