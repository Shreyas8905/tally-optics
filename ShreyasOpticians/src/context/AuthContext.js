import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await client.post('/auth/login', {
        username,
        password,
      });
      const token = response.data.access_token;
      setUserToken(token);
      await AsyncStorage.setItem('userToken', token);
    } catch (error) {
        console.error("Login Failed", error);
        throw error;
    }
  };

  // NEW: Register function
  const register = async (username, password) => {
    try {
      await client.post('/auth/register', {
        username,
        password,
      });
    } catch (error) {
      console.error("Registration Failed", error);
      throw error;
    }
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
  };

  const isLoggedIn = async () => {
    try {
      let token = await AsyncStorage.getItem('userToken');
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
    <AuthContext.Provider value={{ login, logout, register, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};