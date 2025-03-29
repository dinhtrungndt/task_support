import React, { useState, useEffect } from 'react';
import { Routers } from "./routers";
import axiosClient from './api/axiosClient.ts';
import LoadingScreen from './components/loading/loading.js';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading or API initialization
    const initializeApp = async () => {
      try {
        await axiosClient.get('/city');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return <Routers />;
}