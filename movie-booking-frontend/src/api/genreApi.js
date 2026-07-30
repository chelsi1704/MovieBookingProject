import axiosInstance from "./axiosInstance";

const genreApi = {
  getAll: () => axiosInstance.get("/api/genres"),
};

export default genreApi;