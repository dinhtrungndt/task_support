// services/user.js
import axiosClient from "../api/axiosClient.ts";
import { secureStorage } from "../utils/secureDataUtils";

// register
export const register = async (form) => {
  try {
    const res = await axiosClient.post("/users/signup", form);
    return res;
  } catch (error) {
    throw error;
  }
};

// login
export const login = async ({ email, password }) => {
  try {
    const { data } = await axiosClient.post("/users/login", { email, password });
    
    // Kiểm tra trạng thái phản hồi
    if (data.status !== 200) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }
    
    // Lưu token và dữ liệu người dùng an toàn
    if (data.accessToken) {
      secureStorage.setItem("token", data.accessToken);
    } else if (data.token) {
      secureStorage.setItem("token", data.token);
    }
    
    // Lưu refresh token nếu có
    if (data.refreshToken) {
      secureStorage.setItem("refreshToken", data.refreshToken);
    }
    
    // Lưu thông tin người dùng
    if (data.user) {
      secureStorage.setItem("user", data.user);
    }
    
    return data.user;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
}

// Refresh token
export const refreshToken = async () => {
  try {
    const refreshToken = secureStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("Không có refresh token");
    }
    
    const { data } = await axiosClient.post("/users/refresh-token", { refreshToken });
    
    if (data.accessToken) {
      secureStorage.setItem("token", data.accessToken);
      return data.accessToken;
    }
    
    return null;
  } catch (error) {
    console.error("Refresh token error:", error);
    // Đăng xuất người dùng khi refresh token thất bại
    logout();
    return null;
  }
}

// Phương thức đăng xuất
export const logout = () => {
  secureStorage.removeItem("token");
  secureStorage.removeItem("refreshToken");
  secureStorage.removeItem("user");
};

// get idUser
export const getIdUser = async (idUser) => {
  try {
    const { data } = await axiosClient.get(`/users/${idUser}`);
    return data;
  } catch (error) {
    return null;
  }
};