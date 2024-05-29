import { useQuery } from '@apollo/client';

import CategoryList from '../components/categories';

import { GET_CATEGORIES } from '../utils/queries'


const Home = () => {
  const { loading, data } = useQuery(GET_CATEGORIES);
  const categories = data?.categories || [];

  return (
    <main>
      <div className="flex-row justify-center">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <CategoryList
              categories={categories}
              className="main-title"
              title="Instructify"
              all="View all categories"
            />
          )}
      </div>
    </main>
  );
};

export default Home;

