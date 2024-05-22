import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (you can replace this with your actual authentication logic)
    const userLoggedIn = false; // Replace with actual login check
    setIsLoggedIn(userLoggedIn);
  }, []);

  const handleLogout = () => {
    // Handle logout logic here
    setIsLoggedIn(false);
  };

  return (
    <React.Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <Link className="navbar-brand" to="/">Instructify</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">Search Videos</Link>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <button className="btn btn-secondary nav-link">Login</button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-secondary nav-link">Sign Up</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-secondary nav-link" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
