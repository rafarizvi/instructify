// client/src/components/Navbar.jsx
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
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/search">Search Videos</Link>
            </li>
          </ul>
        </div>

        <section className="auth-buttons">
          {!isLoggedIn ? (
            <>
              <button className="btn btn-secondary">Login</button>
              <button className="btn btn-secondary">Sign Up</button>
            </>
          ) : (
            <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
          )}
        </section>
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
