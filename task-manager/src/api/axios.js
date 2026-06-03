import axios from "axios";

const api = axios.create({
  baseURL: "/",
});

export const getApiErrorMessage = (error) => {
  if (error?.userMessage) return error.userMessage;

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.status === 404) {
    return "The requested item was not found.";
  }

  if (error?.response?.status >= 500) {
    return "Something went wrong. Please try again.";
  }

  if (error?.code === "ERR_NETWORK" || !error?.response) {
    return "Network error. Please check your connection.";
  }

  return "Something went wrong. Please try again.";
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const isLoginRequest = requestUrl.includes("/auth/login");

    if (status === 401 && !isLoginRequest) {
      const message = "Session expired. Please login again.";

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.setItem("authMessage", message);
      window.dispatchEvent(new CustomEvent("auth:expired"));

      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }

      error.userMessage = message;
    } else {
      error.userMessage = getApiErrorMessage(error);
    }

    return Promise.reject(error);
  },
);

export default api;
