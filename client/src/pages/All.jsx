import React from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

import { QUERY_ALL_TUTORIALS } from '../utils/queries';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../pages/tutorialCategories.css'

function All() {
  // Fetch all tutorials
  const { loading, data, error } = useQuery(QUERY_ALL_TUTORIALS);

  const navigate = useNavigate();
  const handleButtonClick = (buttonId) => {
    navigate('/categories/view-tutorial', { state: { clickButton: buttonId } });
  };

  return (
    <>
      <h3 style={{'textAlign':'center', 'padding':'10px'}}>All Tutorials</h3>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className='categoryDiv'>
          {
            data.tutorials.map((tutorial) => (
              <div key={tutorial._id}>
                <Button className='tutorialBtn'
                  onClick={() => handleButtonClick(tutorial._id)}
                >
                  <Card style={{ width: '18rem' }} className="tutorialCard">
                    <Card.Img variant="top" className='tutorialImg' />
                    <Card.Body className='tutorialContent'>
                      <Card.Title>{tutorial.title}</Card.Title>
                    </Card.Body>
                  </Card>
                </Button>
              </div>
            ))}
        </div>
      )}
    </>
  );
}

export default All;
