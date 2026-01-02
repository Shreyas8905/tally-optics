import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL =
  "https://tally-optics-5n1tsbp7n-shreyas-projects-885491d1.vercel.app";

const client = axios.create({
  baseURL: BASE_URL,
});

client.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
