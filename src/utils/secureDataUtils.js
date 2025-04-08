import CryptoJS from 'crypto-js';

// Mã hóa dữ liệu nhạy cảm trước khi lưu vào localStorage
export const encryptData = (data, secretKey) => {
  if (!data) return null;
  
  const dataString = typeof data === 'object' ? JSON.stringify(data) : String(data);
  return CryptoJS.AES.encrypt(dataString, secretKey).toString();
};

// Giải mã dữ liệu từ localStorage
export const decryptData = (encryptedData, secretKey) => {
  if (!encryptedData) return null;
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) return null;
    
    // Thử parse thành JSON nếu có thể
    try {
      return JSON.parse(decryptedString);
    } catch (e) {
      // Nếu không phải JSON, trả về string
      return decryptedString;
    }
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Lưu dữ liệu nhạy cảm vào localStorage với mã hóa
export const secureStorage = {
  setItem: (key, value) => {
    try {
      // For objects, convert to string
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
      localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },
  
  getItem: (key) => {
    try {
      const value = localStorage.getItem(key);
      
      // Try to parse as JSON in case it's an object
      try {
        return JSON.parse(value);
      } catch {
        // If parsing fails, it's a simple string
        return value;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },
  
  removeItem: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }
};
