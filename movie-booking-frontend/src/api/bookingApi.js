import axiosInstance from "./axiosInstance";
const bookingApi = {
  create: (data) =>
    axiosInstance.post("/api/bookings", data),

  getById: (id) =>
    axiosInstance.get(`/api/bookings/${id}`),

  getByRef: (ref) =>
    axiosInstance.get(`/api/bookings/ref/${ref}`),

  getMyBookings: () =>
    axiosInstance.get("/api/bookings/my"),

  getTickets: (bookingId) =>
    axiosInstance.get(`/api/bookings/${bookingId}/tickets`),

  cancel: (data) =>
    axiosInstance.post("/api/bookings/cancel", data),

  downloadTicketPdf: (bookingId) =>
    axiosInstance.get(
      `/api/bookings/${bookingId}/ticket-pdf`,
      {
        responseType: "blob",
      }
    ),

  // ADMIN
  getByShowtime: (showtimeId) =>
    axiosInstance.get(`/api/bookings/showtime/${showtimeId}`),
  getAll: async () => {
  try {
    console.log("bookingApi.getAll called");

    const res = await axiosInstance.get("/api/bookings");

    console.log("SUCCESS", res);

    return res;
  } catch (e) {
    console.log("ERROR", e);
    throw e;
  }
},
};

export default bookingApi;