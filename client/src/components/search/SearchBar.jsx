// import {
//   useContext,
//   Form,
//   PropTypes,
//   SearchContext
// } from './index'

import React, { useContext } from 'react';
import Form from 'react-bootstrap/Form';
import { SearchContext } from './SearchContext';
import { PropTypes } from 'prop-types';



import './assets/searchBar.css'

const SearchBar = ({ handleSearchSubmit }) => {
  const { searchTutorial, setSearchTutorial } = useContext(SearchContext);

  return (
    <div>
      <Form className="d-flex justify-content-center mb-4 m-4 searchbar" onSubmit={handleSearchSubmit}>
        <Form.Control
          type="search"
          placeholder="Looking for a specific tutorial?"
          aria-label="Search"
          value={searchTutorial}
          onChange={(e) => setSearchTutorial(e.target.value)}
          style={{ width: '40%' }}
        />
      </Form>
    </div>
  );
};

SearchBar.propTypes = {
  handleSearchSubmit: PropTypes.func.isRequired
}

export default SearchBar;
