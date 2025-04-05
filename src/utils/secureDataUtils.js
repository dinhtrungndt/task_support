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
    const secretKey = process.env.REACT_APP_STORAGE_SECRET || 'default-secure-key';
    const encryptedValue = encryptData(value, secretKey);
    localStorage.setItem(key, encryptedValue);
  },
  
  getItem: (key) => {
    const secretKey = process.env.REACT_APP_STORAGE_SECRET || 'default-secure-key';
    const encryptedValue = localStorage.getItem(key);
    return decryptData(encryptedValue, secretKey);
  },
  
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};