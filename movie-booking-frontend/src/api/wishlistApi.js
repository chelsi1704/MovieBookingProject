import axiosInstance from './axiosInstance';

const wishlistApi = {
  add: (movieId) =>
    axiosInstance.post(`/api/wishlist/${movieId}`),

  remove: (movieId) =>
    axiosInstance.delete(`/api/wishlist/${movieId}`),

  getAll: () =>
    axiosInstance.get('/api/wishlist'),

  check: (movieId) =>
    axiosInstance.get(`/api/wishlist/${movieId}/check`),
};

export default wishlistApi;