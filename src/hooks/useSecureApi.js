import { useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { apiErrorToast } from '../components/ui/CustomToast';

export const useSecureApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Hàm generic để gọi API an toàn
  const callApi = useCallback(async (method, url, data = null, showErrorToast = true) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (method.toLowerCase()) {
        case 'get':
          response = await axiosClient.get(url);
          break;
        case 'post':
          response = await axiosClient.post(url, data);
          break;
        case 'put':
          response = await axiosClient.put(url, data);
          break;
        case 'delete':
          response = await axiosClient.delete(url, { data });
          break;
        default:
          throw new Error(`Unsupported method: ${method}`);
      }
      
      return response.data;
    } catch (err) {
      setError(err);
      
      if (showErrorToast) {
        apiErrorToast(err);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Phương thức làm việc với từng HTTP method
  const secureGet = useCallback((url, showErrorToast = true) => {
    return callApi('get', url, null, showErrorToast);
  }, [callApi]);
  
  const securePost = useCallback((url, data, showErrorToast = true) => {
    return callApi('post', url, data, showErrorToast);
  }, [callApi]);
  
  const securePut = useCallback((url, data, showErrorToast = true) => {
    return callApi('put', url, data, showErrorToast);
  }, [callApi]);
  
  const secureDelete = useCallback((url, data, showErrorToast = true) => {
    return callApi('delete', url, data, showErrorToast);
  }, [callApi]);
  
  return {
    loading,
    error,
    secureGet,
    securePost,
    securePut,
    secureDelete
  };
};