import axiosInstance from './axiosInstance';

// Create Review
export const createReview = async (reviewData) => {
  try {
    const response = await axiosInstance.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get All Reviews for a Movie
export const getMovieReviews = async (movieId, page = 1, limit = 10, sortBy = 'recent') => {
  try {
    const response = await axiosInstance.get(`/movies/${movieId}/reviews`, {
      params: { page, limit, sortBy }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Reviews by User
export const getUserReviews = async (userId, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/users/${userId}/reviews`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Single Review
export const getReview = async (reviewId) => {
  try {
    const response = await axiosInstance.get(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Review
export const updateReview = async (reviewId, updateData) => {
  try {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete Review
export const deleteReview = async (reviewId) => {
  try {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Like/Unlike Review
export const toggleReviewLike = async (reviewId) => {
  try {
    const response = await axiosInstance.post(`/reviews/${reviewId}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Report Review (Inappropriate Content)
export const reportReview = async (reviewId, reason) => {
  try {
    const response = await axiosInstance.post(`/reviews/${reviewId}/report`, { reason });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Movie Rating Summary
export const getMovieRatingSummary = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/movies/${movieId}/rating-summary`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Add Reply to Review (Comment)
export const replyToReview = async (reviewId, reply) => {
  try {
    const response = await axiosInstance.post(`/reviews/${reviewId}/replies`, { text: reply });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Review Replies
export const getReviewReplies = async (reviewId) => {
  try {
    const response = await axiosInstance.get(`/reviews/${reviewId}/replies`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete Reply
export const deleteReply = async (reviewId, replyId) => {
  try {
    const response = await axiosInstance.delete(`/reviews/${reviewId}/replies/${replyId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Top Reviews (Most Helpful/Recent)
export const getTopReviews = async (movieId, limit = 5) => {
  try {
    const response = await axiosInstance.get(`/movies/${movieId}/reviews/top`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Verify if User Can Review Movie
export const canUserReview = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/movies/${movieId}/can-review`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get User's Review for a Movie
export const getUserReviewForMovie = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/movies/${movieId}/my-review`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Reviews Statistics
export const getReviewsStatistics = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/movies/${movieId}/reviews-stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Search Reviews
export const searchReviews = async (query, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/reviews/search', {
      params: { query, page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Reviews by Rating
export const getReviewsByRating = async (movieId, rating, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/movies/${movieId}/reviews/rating/${rating}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
