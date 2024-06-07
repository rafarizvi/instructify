import './assets/categories.css';
import '../../App.css';

import { 
  Link,
  useNavigate,
  PropTypes
  } from './index'

const CategoryList = ({ categories, title, all }) => {
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    navigate('/categories', { state: { clickButton: buttonName } });
  };

  return (
    <div>
      <h1 className="mb-4 text-center">{title}</h1>
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

CategoryList.propTypes = {
  categories: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  all: PropTypes.string.isRequired,
};

export default CategoryList;
