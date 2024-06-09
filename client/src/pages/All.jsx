import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_ALL_TUTORIALS } from '../utils/queries';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../pages/tutorialCategories.css';

//importing for search feature in navbar throughout all page
import  { SearchContext } from '../components/search/SearchContext';



function All() {
  const { loading, data, error } = useQuery(QUERY_ALL_TUTORIALS);
  
  // adding search tutorial to be used within search feature/ context
  const { searchTutorial } = useContext(SearchContext);
  const navigate = useNavigate();
  const handleButtonClick = (buttonId) => {
    navigate('/categories/view-tutorial', { state: { clickButton: buttonId } });
  };

  // using filter to search for a tutorial by the user. If no tutorials are found via filter, user will get a message
  const filteredTutorials = data?.tutorials.filter(tutorial =>
    tutorial.title.toLowerCase().includes(searchTutorial.toLowerCase())
  );

  return (
    <>
      <h3 className='title' style={{ 'textAlign': 'center', 'padding': '10px', fontSize: '50px' }}>All Tutorials</h3>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className='categoryDiv'>
          {filteredTutorials.length > 0 ? (
            filteredTutorials.map((tutorial) => (
              <div key={tutorial._id}>
                <Button className='tutorialBtn' onClick={() => handleButtonClick(tutorial._id)}>
                  <Card style={{ width: '18rem' }} className="tutorialCard">
                    <Card.Img variant="top" className='tutorialImg' />
                    <Card.Body className='tutorialContent'>
                      <Card.Title>{tutorial.title}</Card.Title>
                    </Card.Body>
                  </Card>
                </Button>
              </div>
            ))
          ) : (
            // added if no tutorials are found with an option to make a new one!
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', fontSize: '20px' }}>
              <p style={{ textAlign: 'center' }}>No tutorials found based on your search. Would you like to start one?</p>
              <Button className='tutorialBtn' onClick={() => navigate('/tutorial')}> Create a tutorial</Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default All;
