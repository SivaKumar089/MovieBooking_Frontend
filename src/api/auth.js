import axios from "axios";

export const refreshAccessToken = async (refreshToken) => {
  const response = await axios.post("/api/token/refresh/", {
    refresh: refreshToken,
  });
  return response.data; 
};
