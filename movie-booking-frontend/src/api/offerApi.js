import axiosInstance from './axiosInstance';

const offerApi = {
  getValid: () =>
    axiosInstance.get('/api/offers'),

  apply: (data) =>
    axiosInstance.post('/api/offers/apply', data),
};

export default offerApi;