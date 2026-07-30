import axiosInstance from "./axiosInstance";

const languageApi = {
  getAll: () => axiosInstance.get("/api/languages"),
};

export default languageApi;