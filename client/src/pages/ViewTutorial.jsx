// use pass buttonId using onclick from tutorialVategories function

//Querry all tutorials. 
// Then map over tutorials._id from querry === tutotials._id passed from tutorialCategories 
// if true. render


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import '../pages/tutorialCategories.css'

// React bootsrap imports
import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
import Card from 'react-bootstrap/Card';
import '../pages/viewTutorial.css'

import { QUERY_ALL_TUTORIALS } from '../utils/queries';

const ViewTutorial = () => {
  const location = useLocation();
  const { clickButton } = location.state || {};
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const { loading, data } = useQuery(QUERY_ALL_TUTORIALS);
  const tutorials = data?.tutorials || [];

  
  useEffect(() => {
    if (clickButton && tutorials.length > 0) {
      const findTutorial = async () => {
        const tutorial = tutorials.find(tutorial => tutorial._id === clickButton);
        if (tutorial) {
          setSelectedTutorial(tutorial);
        }
      };
      findTutorial();
    }
  }, [clickButton, tutorials]);


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
      <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title>{selectedTutorial.title}</Card.Title>
          <Card.Text>{selectedTutorial.title}</Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};



export default ViewTutorial;