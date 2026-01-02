import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const login = async (username, password) => {
    try {
      const formData = `username=${encodeURIComponent(
        username
      )}&password=${encodeURIComponent(password)}`;

      const response = await client.post("/auth/login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const token = response.data.access_token;
      setUserToken(token);
      await AsyncStorage.setItem("userToken", token);
    } catch (error) {
      console.error("Login Failed", error.response?.data || error.message);
      throw error;
    }
  };

  const register = async (username, password) => {
    try {
      // Register expects JSON (Pydantic model), so this remains the same
      await client.post("/auth/register", {
        username,
        password,
      });
    } catch (error) {
      console.error(
        "Registration Failed",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem("userToken");
  };

  const isLoggedIn = async () => {
    try {
      let token = await AsyncStorage.getItem("userToken");
      setUserToken(token);
    } catch (e) {
      console.log(`isLoggedIn error ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, register, isLoading, userToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
