// use pass buttonId using onclick from tutorialVategories function

//Querry all tutorials. 
// Then map over tutorials._id from querry === tutotials._id passed from tutorialCategories 
// if true. render


import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';



import '../pages/viewTutorial.css'

// React bootsrap imports
import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
import Card from 'react-bootstrap/Card';


import { QUERY_TUTORIALS } from '../utils/queries';
import { ADD_COMMENT } from '../utils/mutations';

import Auth from '../utils/auth';

const ViewTutorial = () => {

  
  const location = useLocation();
  const { clickButton } = location.state || {};
  const { loading, data } = useQuery(QUERY_TUTORIALS);
  const tutorials = data?.tutorials || [];


  const clickedTutorial = [];
  tutorials.map((tutorial) => {
    if (tutorial._id === clickButton) {
      clickedTutorial.push(tutorial);
    }
  });


  // Handle adding comments

  // if (profileId === undefined)


  // const profileId = Auth.getProfile().data._id;
  const profileId = Auth.loggedIn() ? Auth.getProfile().data._id : null;
    const tutorialId = clickButton;
  
    const [content, setContent] = useState('');
  
    const [addcontent, { error }] = useMutation(ADD_COMMENT);
  
    const handleFormSubmit = async (event) => {
      event.preventDefault();
  
      try {
        const data = await addcontent({
          variables: { profileId, tutorialId, content },
        });
  
        setContent('');
      } catch (err) {
        console.error(err);
      }
    }


  // // Deleting comments
  // const handleDelete = async (tutorialId) => {
  //   try {
  //     await removeTutorial({
  //       variables: { id: tutorialId }
  //     });
  //   } catch (e) {
  //     console.error('Error during mutation:', e);
  //   }
  // };


  return (
    <>
      {/* Image carousel of added */}
      <Carousel>
        <Carousel.Item>
          {/* <ExampleCarouselImage text="First slide" /> */}
          <Carousel.Caption>
            <h3>First slide label</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          {/* <ExampleCarouselImage text="Second slide" /> */}
          <Carousel.Caption>
            <h3>Second slide label</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          {/* <ExampleCarouselImage text="Third slide" /> */}
          <Carousel.Caption>
            <h3>Third slide label</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>







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
                      <form
                        className="flex-row justify-center justify-space-between-md align-center"
                        onSubmit={handleFormSubmit}
                      >
                        <div className="col-12 col-lg-9">
                          <input
                            placeholder="Type here..."
                            type='text'
                            value={content}
                            className="form-input w-100"
                            onChange={(event) => setContent(event.target.value)}
                          />
                        </div>

                        <div className="col-12 col-lg-3">
                          <button className="btn btn-info btn-block py-3" type="submit">
                            Submit
                          </button>
                        </div>
                        {error && (
                          <div className="col-12 my-3 bg-danger text-white p-3">
                            {error.message}
                          </div>
                        )}
                      </form>
                    ) : (
                      <p>
                        You need to be logged in to add comments. Please{' '}
                        <Link to="/login">login</Link> or <Link to="/signup">signup.</Link>
                      </p>
                    )}
                  </div>


                    <h4 style={{ 'fontWeight': 'bold', 'paddingBottom': '10px' }}>Comments</h4>
                    {clickedTutorial.comments.map((comments) => (
                      <div key={comments._id}>
                        <span className="badge text-bg-secondary">{comments.author.name}</span>
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