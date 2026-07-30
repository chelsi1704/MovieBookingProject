import axiosInstance from "./axiosInstance";

const paymentApi = {
  initiate: (data) =>
    axiosInstance.post("/api/payments/initiate", data),

  confirm: (data) =>
    axiosInstance.post("/api/payments/confirm", data),

  getByBooking: (bookingId) =>
    axiosInstance.get(`/api/payments/booking/${bookingId}`),

  // NEW
  sendOtp: (bookingId) => {
  console.log("SEND OTP API", bookingId);

  return axiosInstance.post(
    `/api/payments/send-otp/${bookingId}`
  );
},

  // NEW
  verifyOtp: (bookingId, otp) =>
    axiosInstance.post(
      `/api/payments/verify-otp/${bookingId}?otp=${otp}`
    ),
};

export default paymentApi;