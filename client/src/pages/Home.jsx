import CategoryList from '../components/categories';

const Home = () => {
  const categories = [
    {
      name:'Tech',
      id:1
    },
    {
      name:'Academics',
      id:2
    },
    {
      name:'Home',
      id:3
    },
    {
      name:'Arts',
      id:4
    },
    {
      name:'Lifestyle/Hobbies',
      id:5
    },
    {
      name:'Business/Financial',
      id:6
    }
  ]

  return (
    <main>
      <div className="flex-row justify-center">
            <CategoryList
              categories={categories}
              className="main-title"
              title="Instructify"
              all="View all categories"
            />
      </div>
    </main>
  );
};

export default Home;

