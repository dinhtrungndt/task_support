import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  process.env.REACT_APP_ENCRYPTION_KEY || "REACT_APP_ENCRYPTION_KEY";

/**
 * Lớp thực hiện mã hóa thực sự cho localStorage
 */
class SecureStorage {
  /**
   * Mã hóa và lưu trữ dữ liệu
   * @param {string} key - Khóa để lưu trữ dữ liệu
   * @param {any} value - Giá trị cần mã hóa và lưu trữ
   */
  setItem(key, value) {
    try {
      // Chuyển đổi object thành chuỗi JSON
      const valueToStore = JSON.stringify(value);

      // Mã hóa dữ liệu
      const encrypted = CryptoJS.AES.encrypt(
        valueToStore,
        ENCRYPTION_KEY
      ).toString();

      // Lưu dữ liệu đã mã hóa vào localStorage
      localStorage.setItem(key, encrypted);
    } catch (error) {
      // console.error("Error encrypting and storing data:", key);
    }
  }

  /**
   * Lấy và giải mã dữ liệu
   * @param {string} key - Khóa để lấy dữ liệu
   * @returns {any|null} Dữ liệu đã giải mã hoặc null nếu có lỗi
   */
  getItem(key) {
    try {
      // Lấy dữ liệu đã mã hóa từ localStorage
      const encrypted = localStorage.getItem(key);

      if (!encrypted) {
        return null;
      }

      // Giải mã dữ liệu
      const decrypted = CryptoJS.AES.decrypt(
        encrypted,
        ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);

      if (!decrypted) {
        return null;
      }

      // Chuyển đổi chuỗi JSON thành object
      return JSON.parse(decrypted);
    } catch (error) {
      // console.error("Error decrypting data:", key);
      return null;
    }
  }

  /**
   * Xóa dữ liệu
   * @param {string} key - Khóa cần xóa
   */
  removeItem(key) {
    localStorage.removeItem(key);
  }

  /**
   * Xóa tất cả dữ liệu
   */
  clear() {
    localStorage.clear();
  }
}

// Export một instance duy nhất
export const secureStorage = new SecureStorage();

// Để tương thích với API cũ
export default secureStorage;
