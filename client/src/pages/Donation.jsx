import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { GIVE_DONATION } from '../utils/mutations';

const Donation = () => {
  const [amount, setAmount] = useState(0);
  const [giveDonation, { data, loading, error }] = useMutation(GIVE_DONATION);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    if (window.Stripe) {
      // Test publishable api key
      setStripe(window.Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx')); 
    }
  }, []);

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      const response = await giveDonation({ variables: { amount: parseFloat(amount) } });
      const sessionId = response.data.giveDonation.session;
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      } else {
        console.error('Stripe.js has not loaded yet.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{'textAlign': 'center', 'margin': '10%', 'padding': '2%'}}>
      <h1 style={{'margin': '5px'}}>Donate</h1>
      <h3>Please consider donating to Instructify to keep us up and running for free!</h3>
      <form onSubmit={handleDonate} style={{'margin': '5px'}}>
        <label style={{'fontSize': '24px', 'marginTop': '20px'}}>
          Enter amount in whole number $:
          <input style={{'marginLeft': '10px', 'borderRadius':'8px'}}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label> <br></br>
        <button style={{'marginTop': '10px'}} className="btn btn-success" type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Donate'}
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Donation;
