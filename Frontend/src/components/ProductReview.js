// ProductReview.js
import React, { useState } from 'react';
import StarRating from './StarRating'; // Import the star rating component
import './ProductReview.css'; // Add styles for the form

const ProductReview = ({ productId, submitReview }) => {
  const [comments, setComments] = useState('');
  const [rating, setRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comments || rating === 0) {
      alert('Please provide both a rating and a review');
      return;
    }

    // Call the submit review function (from parent or API)
    submitReview({ productId, rating, comments });

    // Clear the form
    setComments('');
    setRating(0);
  };

  return (
    <div className="review-form">
      <h3>Leave a Review</h3>
      <form onSubmit={handleSubmit}>
        <StarRating rating={rating} setRating={setRating} />
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Write your review here..."
          required
        ></textarea>
        <button type="submit" className="submit-btn">
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ProductReview;
