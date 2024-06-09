import React, { createContext, useState } from 'react';
import { PropTypes } from 'prop-types';



// import { 
//   createContext, 
//   useState,
//   PropTypes } from './index';
  
  const SearchContext = createContext();
  
  const SearchProvider = ({ children }) => {
  const [searchTutorial, setSearchTutorial] = useState('');
  return (
    <SearchContext.Provider value={{ searchTutorial, setSearchTutorial }}>
      {children}
    </SearchContext.Provider>
  );
};

SearchProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { SearchContext, SearchProvider };
