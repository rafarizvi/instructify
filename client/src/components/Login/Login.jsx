import { 
  React,
  useState,
  useMutation,
  useNavigate,
  LOGIN_USER,
  Auth
 } from './index'

const Login = () => {
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [login, { error }] = useMutation(LOGIN_USER);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
      navigate('/');
    } catch (e) {
      console.error(e);
    }

    setFormState({ email: '', password: '' });
  };

  return (
    <React.Fragment>
      <main className="flex-row justify-center align-center min-100-vh">
      <div className="form-container">
        <h4 className="form-title">Login</h4>
        <form onSubmit={handleFormSubmit} className="form-content">
          <input
            className="form-input-login"
            placeholder="Your email"
            name="email"
            type="email"
            value={formState.email}
            onChange={handleChange}
          />
          <input
            className="form-input-login"
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

          <p className='text-center'>Don't have an account? <a href="/signup">Signup</a> here.</p>
        </form>
        {error && (
          <div className="form-error">
            Incorrect email or password. Please try again.
          </div>
        )}
      </div>
      </main>
    </React.Fragment>
    
  );
};

export default Login;