// StarRating.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import './StarRating.css'; // You can add custom styles here

const StarRating = ({ rating, setRating }) => {
  const handleRating = (newRating) => {
    setRating(newRating);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <FontAwesomeIcon
          key={star}
          icon={faStar}
          onClick={() => handleRating(star)}
          className={star <= rating ? 'star selected' : 'star'}
        />
      ))}
    </div>
  );
};

export default StarRating;
