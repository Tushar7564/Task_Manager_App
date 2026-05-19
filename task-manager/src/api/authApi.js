import api from "./axios";

export const registerUser = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data.data;
};

export const loginUser = async (formData) => {
  const response = await api.post("/auth/login", formData);
  return response.data.data;
};
