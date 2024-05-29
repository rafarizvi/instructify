import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import './Categories.css';
import '../../App.css';

const CategoryList = ({ categories, title, all }) => {
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    navigate('/categories', { state: { clickButton: buttonName } });
  };

  return (
    <div>
      <h1 className="mb-4 text-center">instructify</h1>
      <p className="lead text-center">Empowering Knowledge Sharing,<br /> One Tutorial at a Time</p>

      <div className="catDiv">
        <Link className="btn btn-squared text-dark category-link" to={'/all'}>
          <h4 className="bg-dark text-light p-2 m-0 catBtn">{all}</h4>
        </Link>
      </div>

      <div className="catDiv">
        {categories && categories.map((category) => (
          <div key={category.id}>
            <button className="btn btn-squared category-link" onClick={() => handleButtonClick(category.name)}>
              <h4 className="bg-dark text-light p-2 m-0 catBtn">{category.name} <br /></h4>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;