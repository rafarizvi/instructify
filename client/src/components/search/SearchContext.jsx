import React, { createContext, useState } from 'react';

const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [searchTutorial, setSearchTutorial] = useState('');

  return (
    <SearchContext.Provider value={{ searchTutorial, setSearchTutorial }}>
      {children}
    </SearchContext.Provider>
  );
};

export { SearchContext, SearchProvider };
