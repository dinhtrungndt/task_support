import React, { useState, useEffect } from 'react';
import { Routers } from "./routers";
import axiosClient from './api/axiosClient.ts';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await axiosClient.get('/companies');
        
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
    return 
  }

  return <Routers />;
}