import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_ALL_TUTORIALS } from '../utils/queries';

function Home() {
  const categories = ["Category1", "Category2", "Category3"]; 

  // Fetch all tutorials
  const { loading, data, error } = useQuery(QUERY_ALL_TUTORIALS);

  return (
    <div className="container mt-5 pt-5"> 
      {/* Introductory Section */}

      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">instructify</h1>
          <p className="lead">Empowering Knowledge Sharing,<br /> One Tutorial at a Time</p>
          <section className="categories mb-4">
            <h2 className="h4">Categories</h2>
            <ul className="list-group">
              {categories.map((category, index) => (
                <li key={index} className="list-group-item">
                  <Link to={`/tutorial/${category.toLowerCase()}`} className="category-link">
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Tutorials Section */}
      <div className="row mt-5">
        <div className="col-12">
          <section className="tutorials">
            <h2 className="h4">All Tutorials</h2>
            {loading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error.message}</div>
            ) : (
              <div className="row">
                {data.tutorials.map(tutorial => (
                  <div key={tutorial._id} className="col-md-3 mb-4">
                    <div className="card h-100">
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{tutorial.title}</h5>
                        <p className="card-text flex-grow-1">{tutorial.content}</p>
                        <p className="card-text"><small className="text-muted">Author: {tutorial.author.name}</small></p>
                        <p className="card-text"><small className="text-muted">Category: {tutorial.category?.name || 'Unknown'}</small></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;
