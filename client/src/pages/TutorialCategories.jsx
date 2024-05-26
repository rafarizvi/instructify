import React from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';

import { QUERY_ALL_TUTORIALS } from '../utils/queries';

const TutorialCategories = () => {
  const location = useLocation();
  const { clickButton } = location.state || {};

  return (
    <div>
      {clickButton === 'Tech' && <p> Tech was clicked </p>}


      {clickButton === 'Academics' && <p> Academics was clicked </p>}


      {clickButton === 'Home' && <p> Home was clicked </p>}
      
      
      {clickButton === 'Arts' && <p> Arts was clicked </p>}
      
      
      {clickButton === 'Lifestyle/Hobbies' && <p> Lifestyle/Hobbies </p>}
      
      
      {clickButton === 'Business/Financial' && <p> Business/Financial </p>}
    </div>
  )

};



export default TutorialCategories;