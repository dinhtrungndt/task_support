import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "react-toastify";
import { register } from "../../services/user";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const navigate = useNavigate();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    // Kiểm tra tên
    if (!form.name.trim()) {
      newErrors.name = "Vui lòng nhập tên của bạn";
      isValid = false;
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Tên phải có ít nhất 2 ký tự";
      isValid = false;
    }

    // Kiểm tra email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "Vui lòng nhập email của bạn";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Kiểm tra mật khẩu
    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    } else if (form.password.length < 3) {
      newErrors.password = "Mật khẩu phải có ít nhất 3 ký tự";
      isValid = false;
    }

    // Kiểm tra xác nhận mật khẩu
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = {
        name: form.name,
        email: form.email,
        password: form.password
      };
      
      const res = await register(formData);
      
      if (res.data && res.data.status === 400) {
        toast.error("Email đã tồn tại!");
        return;
      }
      
      if (res.status === 200) {
        toast.success("Đăng ký thành công!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Đăng ký thất bại, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br to-teal-100">
      <div className="w-full max-w-md bg-slate-400 p-2 shadow-md rounded-lg border border-gray-200">
        <div className="bg-white p-8 shadow-lg rounded-xl border border-gray-100">
            <h1 className="text-xl font-bold text-gray-800">Tạo Tài Khoản</h1>
          <form onSubmit={handleSubmit} className="space-y-2">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="name">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Nhập tên của bạn"
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                  onChange={handleChange}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Email của bạn"
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                  onChange={handleChange}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={form.password}
                  placeholder="Tạo mật khẩu"
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="confirmPassword">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full pl-10 pr-4 py-2 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-200"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all`}
                  onChange={handleChange}
                />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                Tôi đồng ý với <a href="#" className="text-green-600 hover:text-green-800">điều khoản</a> và <a href="#" className="text-green-600 hover:text-green-800">chính sách bảo mật</a>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Đăng ký ngay"
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Bạn đã có tài khoản?{" "}
              <span 
                className="text-green-600 font-medium hover:text-green-800 cursor-pointer transition-all" 
                onClick={() => navigate("/login")}
              >
                Đăng nhập ngay
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;