// use pass buttonId using onclick from tutorialVategories function

//Querry all tutorials. 
// Then map over tutorials._id from querry === tutotials._id passed from tutorialCategories 
// if true. render


import React from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import '../pages/viewTutorial.css'

// React bootsrap imports
import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
import Card from 'react-bootstrap/Card';


import { QUERY_TUTORIALS } from '../utils/queries';

const ViewTutorial = () => {
  const location = useLocation();
  const { clickButton } = location.state || {};
  // const [selectedTutorial, setSelectedTutorial] = useState(null);
  const { loading, data } = useQuery(QUERY_TUTORIALS);
  const tutorials = data?.tutorials || [];


  const clickedTutorial = [];
  tutorials.map((tutorial) => {
    if (tutorial._id === clickButton) {
      console.log(tutorial);
      clickedTutorial.push(tutorial);
    }
  });

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

      {/* Card to display tutorial */}
      <div className='tutorialDiv'>
        {clickedTutorial &&
          clickedTutorial.map((clickedTutorial) => (
            <div key={clickedTutorial._id}>

              <Card className='tutorialCard'>
                <Card.Body>
                  <h2 style={{ 'fontWeight':'bold'}}>{clickedTutorial.title}</h2>
                  <h5>By {clickedTutorial.author.name}</h5>
                  <span className="badge text-bg-info">{clickedTutorial.category.name}</span>
                  <div style={{ 'paddingTop': '5%' }}>
                    <p style={{'fontSize':'18px'}}>{clickedTutorial.content} Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora neque quam aliquam maxime atque officiis vel. Hic deleniti quibusdam culpa quidem velit sapiente, error aliquam asperiores inventore ducimus eum non!</p>
                  </div>

                  <div className='commentDiv'>
                    <h4 style={{'fontWeight':'bold', 'paddingBottom': '10px'}}>Comments</h4>
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