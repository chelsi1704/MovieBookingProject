// All movie API calls
import axiosInstance from './axiosInstance';

const movieApi = {
  getNowPlaying: () =>
    axiosInstance.get('/api/movies/now-playing'),

  getUpcoming: () =>
    axiosInstance.get('/api/movies/upcoming'),

  getTopRated: () =>
    axiosInstance.get('/api/movies/top-rated'),

  getById: (id) =>
    axiosInstance.get(`/api/movies/${id}`),

  search: (params) =>
    axiosInstance.get('/api/movies/search', { params }),

  getAll: (params) =>
    axiosInstance.get('/api/movies', { params }),

  getAllGenres: () =>
    axiosInstance.get('/api/movies/genres'),

  getAllLanguages: () =>
    axiosInstance.get('/api/movies/languages'),

  // Admin
  create: (data) =>
    axiosInstance.post('/api/movies', data),

  update: (id, data) =>
    axiosInstance.put(`/api/movies/${id}`, data),

  delete: (id) =>
    axiosInstance.delete(`/api/movies/${id}`),
};

export default movieApi;