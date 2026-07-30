import axiosInstance from "./axiosInstance";

const screenApi = {
  getAll: () =>
    axiosInstance.get("/api/screens"),
};

export default screenApi;