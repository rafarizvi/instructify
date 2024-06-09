import {
  React,
  useState,
  Link, 
  useMutation,
  ADD_PROFILE,
  Auth
} from './index'

const Signup = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [addProfile, { error, data }] = useMutation(ADD_PROFILE);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await addProfile({
        variables: { ...formState },
      });
      Auth.login(data.addProfile.token);
    } catch (e) {
      setErrorMessage(e.message);
    }
  };

  return (
    <React.Fragment>
      <main className="flex-row justify-center align-center min-100-vh">
        <div className="form-container">
          <h4 className="form-title">Sign Up</h4>
          <div className="form-content">
            {data ? (
              <p>
                Success! You may now head <Link to="/">back to the homepage.</Link>
              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <input
                  className="form-input-signup"
                  placeholder="Your username"
                  name="name"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                />
                <input
                  className="form-input-signup"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <input
                  className="form-input-signup"
                  placeholder="Your password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <button
                  className="btn btn-primary btn-block"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>

                <p className='text-center'>Already have an account? <a href="/login">Login</a> here.</p>

              </form>
            )}
            {errorMessage && (
              <div className="form-error">
                {errorMessage}
              </div>
            )}
            {error && !errorMessage && (
              <div className="form-error">
                An unexpected error occurred. Please try again.
              </div>
            )}
          </div>
        </div>
      </main>
    </React.Fragment>
  );
};

export default Signup;