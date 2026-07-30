import axiosInstance from './axiosInstance';

// Get All Theaters
export const getAllTheaters = async (page = 1, limit = 10, filters = {}) => {
  try {
    const response = await axiosInstance.get('/theaters', {
      params: { page, limit, ...filters }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater by ID
export const getTheater = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create Theater (Admin)
export const createTheater = async (theaterData) => {
  try {
    const response = await axiosInstance.post('/theaters', theaterData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Theater (Admin)
export const updateTheater = async (theaterId, theaterData) => {
  try {
    const response = await axiosInstance.put(`/theaters/${theaterId}`, theaterData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete Theater (Admin)
export const deleteTheater = async (theaterId) => {
  try {
    const response = await axiosInstance.delete(`/theaters/${theaterId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theaters by City
export const getTheatersByCity = async (city, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/theaters/city/${city}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theaters Near Location
export const getTheatersNearby = async (latitude, longitude, radiusKm = 10) => {
  try {
    const response = await axiosInstance.get('/theaters/nearby', {
      params: { latitude, longitude, radius: radiusKm }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Screens
export const getTheaterScreens = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}/screens`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Screen Details
export const getScreen = async (screenId) => {
  try {
    const response = await axiosInstance.get(`/screens/${screenId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create Screen (Admin)
export const createScreen = async (theaterId, screenData) => {
  try {
    const response = await axiosInstance.post(`/theaters/${theaterId}/screens`, screenData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Screen (Admin)
export const updateScreen = async (screenId, screenData) => {
  try {
    const response = await axiosInstance.put(`/screens/${screenId}`, screenData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete Screen (Admin)
export const deleteScreen = async (screenId) => {
  try {
    const response = await axiosInstance.delete(`/screens/${screenId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Screen Seats
export const getScreenSeats = async (screenId) => {
  try {
    const response = await axiosInstance.get(`/screens/${screenId}/seats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Seat Layout
export const getScreenSeatLayout = async (screenId) => {
  try {
    const response = await axiosInstance.get(`/screens/${screenId}/seat-layout`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Seat (Admin)
export const updateSeat = async (seatId, seatData) => {
  try {
    const response = await axiosInstance.put(`/seats/${seatId}`, seatData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Amenities
export const getTheaterAmenities = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}/amenities`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Theater Amenities (Admin)
export const updateTheaterAmenities = async (theaterId, amenities) => {
  try {
    const response = await axiosInstance.put(`/theaters/${theaterId}/amenities`, { amenities });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Facilities
export const getTheaterFacilities = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}/facilities`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Pricing
export const getTheaterPricing = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}/pricing`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Theater Pricing (Admin)
export const updateTheaterPricing = async (theaterId, pricingData) => {
  try {
    const response = await axiosInstance.put(`/theaters/${theaterId}/pricing`, pricingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Reviews/Ratings
export const getTheaterRatings = async (theaterId, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}/ratings`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Submit Theater Review/Rating
export const submitTheaterRating = async (theaterId, ratingData) => {
  try {
    const response = await axiosInstance.post(`/theaters/${theaterId}/ratings`, ratingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Photos
export const getTheaterPhotos = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}/photos`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Food Menu
export const getTheaterFoodMenu = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}/food-menu`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Operating Hours
export const getTheaterHours = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}/hours`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update Operating Hours (Admin)
export const updateTheaterHours = async (theaterId, hoursData) => {
  try {
    const response = await axiosInstance.put(`/theaters/${theaterId}/hours`, hoursData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Contact Info
export const getTheaterContact = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/theaters/${theaterId}/contact`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Search Theaters
export const searchTheaters = async (query, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get('/theaters/search', {
      params: { query, page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Popular Theaters
export const getPopularTheaters = async (limit = 10) => {
  try {
    const response = await axiosInstance.get('/theaters/popular', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get Theater Statistics (Admin)
export const getTheaterStats = async (theaterId) => {
  try {
    const response = await axiosInstance.get(`/admin/theaters/${theaterId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
