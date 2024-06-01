import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { GIVE_DONATION } from '../utils/mutations';

const Donation = () => {
  const [amount, setAmount] = useState(0);
  const [giveDonation, { data, loading, error }] = useMutation(GIVE_DONATION);
  const [stripe, setStripe] = useState(null);

  useEffect(() => {
    if (window.Stripe) {
      setStripe(window.Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx')); // Replace with your actual Stripe publishable key
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
    <div>
      <h1>Donate</h1>
      <form onSubmit={handleDonate}>
        <label>
          Donation Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.01"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Donate'}
        </button>
      </form>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
};

export default Donation;