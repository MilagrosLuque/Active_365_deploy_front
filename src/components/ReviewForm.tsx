import React, { useState } from "react";

interface ReviewFormProps {
  productId: string;
  userId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ productId, userId }) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating <= 0 || rating > 5) {
      setError("Rating should be between 1 and 5.");
      return;
    }

    const reviewData = {
      productId,
      userId,
      rating,
      comment,
    };

    try {
      const response = await fetch("/products/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }
      //lo comente porque no se estaba usando 
      //const result = await response.json();
      setSuccessMessage("Review submitted successfully!");
      setRating(0);
      setComment("");
    } catch {
      setError("Error submitting review. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Leave a Review</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating (1-5):</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(Math.min(5, Math.max(1, parseInt(e.target.value))))}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="1"
            max="5"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
