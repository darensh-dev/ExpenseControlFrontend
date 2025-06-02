import Axios from "axios";
import { getSession, handleUnauthorized } from "./useUtils";

import { APP_API_URL } from "@/env-vars";

const unAuthAxios = Axios.create({
  baseURL: APP_API_URL,
  timeout: 20000,
  headers: {
    // "Access-Control-Allow-Origin": "*",
  },
});

const authAxios = Axios.create({
  baseURL: APP_API_URL,
  timeout: 60000,
  // withCredentials: true,
  headers: {
    Accept: "application/json",
    // "Access-Control-Allow-Origin": "*",
  },
  // validateStatus: (status) => [200, 201, 202].includes(status),
});

authAxios.interceptors.request.use(async (config) => {
  try {
    const token = getSession();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  } catch (error) {
    console.error("Error en interceptor de request:", error);
    return config;
  }
});

authAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

export { authAxios, unAuthAxios };
