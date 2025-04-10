import axiosClient from "../api/axiosClient";
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
    const { data } = await axiosClient.post("/users/login", {
      email,
      password,
    });

    // Kiểm tra trạng thái phản hồi
    if (data.status !== 200) {
      throw new Error(data.message || "Đăng nhập thất bại");
    }

    // Lưu token và dữ liệu người dùng an toàn
    if (data.accessToken) {
      secureStorage.setItem("tz", data.accessToken);
    } else if (data.token) {
      secureStorage.setItem("tz", data.token);
    }

    // Lưu refresh token nếu có
    if (data.refreshToken) {
      secureStorage.setItem("rtk", data.refreshToken);
    }

    // Lưu thông tin người dùng
    if (data.user) {
      // Loại bỏ thông tin nhạy cảm trước khi lưu
      const { password, ...safeUserData } = data.user;
      secureStorage.setItem("ts", safeUserData);

      // Trả về dữ liệu người dùng không chứa thông tin nhạy cảm
      return safeUserData;
    }

    return null;
  } catch (error) {
    // Không in chi tiết lỗi để tránh rò rỉ thông tin nhạy cảm
    console.error("Login error");
    return null;
  }
};

// Refresh token
export const refreshToken = async () => {
  try {
    const refreshToken = secureStorage.getItem("rtk");
    if (!refreshToken) {
      console.warn("Không có refresh token");
      return null;
    }

    const { data } = await axiosClient.post("/users/refresh-token", {
      refreshToken,
    });

    if (data && data.accessToken) {
      secureStorage.setItem("tz", data.accessToken);

      // Nếu server trả về refreshToken mới, cập nhật luôn
      if (data.refreshToken) {
        secureStorage.setItem("rtk", data.refreshToken);
      }

      return data.accessToken;
    }

    console.warn("Server không trả về accessToken mới");
    return null;
  } catch (error) {
    // Không log chi tiết lỗi để tránh rò rỉ thông tin nhạy cảm
    console.error("Refresh token error");

    // Chỉ xóa token khi có lỗi nghiêm trọng
    if (error.response && error.response.status === 403) {
      // Nếu server trả về 403 (refresh token không hợp lệ/hết hạn), thì mới logout
      logout();
    }

    return null;
  }
};

// Phương thức đăng xuất
export const logout = () => {
  secureStorage.removeItem("tz");
  secureStorage.removeItem("rtk");
  secureStorage.removeItem("ts");
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
