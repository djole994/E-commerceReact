import React, { useState } from 'react';
import './NewsletterForm.css';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div className="newsletter-container">
      <div className="newsletter-card">
        <h2>Subscribe to our Newsletter</h2>
        <p>Get the latest updates and offers delivered straight to your inbox.</p>
        {submitted ? (
          <div className="thank-you">Thanks for subscribing! ✅</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewsletterForm;
