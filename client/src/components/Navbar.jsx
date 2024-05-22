// client/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  return (
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
        <button className="btn btn-secondary">Login</button>
        <button className="btn btn-secondary">Sign Up</button>
        <button className="btn btn-secondary">Logout</button>
      </section>
    </nav>
  );
};

export default Navbar;
