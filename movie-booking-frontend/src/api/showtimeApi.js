import axiosInstance from "./axiosInstance";
const showtimeApi = {
  search: (data) =>
    axiosInstance.post("/api/showtimes/search", data),

  getById: (id) =>
    axiosInstance.get(`/api/showtimes/${id}`),

  getSeatMap: (id) =>
    axiosInstance.get(`/api/showtimes/${id}/seat-map`),

  getAvailableDates: (movieId, city) =>
    axiosInstance.get(
      `/api/showtimes/available-dates?movieId=${movieId}&city=${city}`
    ),

  getByTheaterAndDate: (theaterId, date) =>
    axiosInstance.get(
      `/api/showtimes/theater/${theaterId}?date=${date}`
    ),

  // ADMIN
  getByScreen: (screenId) =>
    axiosInstance.get(`/api/showtimes/screen/${screenId}`),

  create: (data) =>
    axiosInstance.post("/api/showtimes", data),

  update: (id, data) =>
    axiosInstance.put(`/api/showtimes/${id}`, data),

  cancel: (id) =>
    axiosInstance.put(`/api/showtimes/${id}/cancel`),
  getAll: () =>
  axiosInstance.get("/api/showtimes"),
};

export default showtimeApi;