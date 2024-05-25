import { Link } from 'react-router-dom';

const CategoryList = ({ categories, title, all }) => {

  return (
    <div>
      <h3 className="text-info text-center">{title}</h3>
      <div className="flex-row justify-space-between my-4">

        <div className="col-12 col-xl-6">
          <Link className="btn btn-block btn-squared btn-light text-dark category-link ">
            <h4 className="card-header bg-dark text-light p-2 m-0">{all}</h4>
          </Link>
        </div>


        {categories &&
          categories.map((category) => (
            <div key={category._id} className="col-12 col-xl-6">
              <Link
                className="btn btn-block btn-squared btn-light text-dark category-link"
                to={`/tutorial/${category.name.toLowerCase()}`}
              >
                <h4 className="card-header bg-dark text-light p-2 m-0">
                  {category.name} <br />
                </h4>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};
export default CategoryList;
