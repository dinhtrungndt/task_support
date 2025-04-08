import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { toast } from "react-toastify";
import { register } from "../../services/user";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
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
    
    // Kiểm tra mật khẩu - tăng cường bảo mật hơn
    if (!form.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      isValid = false;
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 1 chữ hoa";
      isValid = false;
    } else if (!/[0-9]/.test(form.password)) {
      newErrors.password = "Mật khẩu phải có ít nhất 1 chữ số";
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
      
      const response = await register(formData);
      
      // Kiểm tra đúng cấu trúc phản hồi từ API
      console.log("API response:", response); // Gỡ lỗi
      
      // Cách xử lý đúng hơn dựa vào cấu trúc API
      if (response && response.data) {
        if (response.data.status === 400 || response.data.status === 202) {
          toast.error(response.data.message || "Email đã tồn tại!");
        } else if (response.data.status === 200) {
          toast.success("Đăng ký thành công!");
          navigate("/login");
        } else {
          // Trường hợp khác
          toast.warning("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      
      // Xử lý lỗi theo loại
      if (error.response) {
        // Lỗi từ server
        toast.error(error.response.data?.message || "Đăng ký thất bại!");
      } else if (error.request) {
        // Không có phản hồi từ server
        toast.error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng!");
      } else {
        // Lỗi khác
        toast.error("Đăng ký thất bại, vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-6xl h-[750px] shadow-2xl rounded-lg overflow-hidden flex bg-white border border-gray-200">
        {/* Left side - Blue background with welcome message */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-blue-500 to-blue-600 text-white p-12 flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500">
            {/* Grid background */}
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
              backgroundSize: '20px 20px'
            }}></div>
            
            {/* Decorative elements */}
            <div className="absolute top-20 left-20 w-20 h-20 bg-blue-400 rounded-full opacity-30 animate-pulse"></div>
            <div className="absolute bottom-40 right-20 w-32 h-32 bg-blue-400 rounded-full opacity-30"></div>
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-blue-400 rounded-full opacity-30"></div>
            
            {/* Additional decorative elements */}
            <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-blue-300 rounded-full opacity-20"></div>
            <div className="absolute top-40 right-40 w-12 h-12 bg-blue-300 rounded-full opacity-20 animate-pulse"></div>
            
            {/* Wave patterns */}
            <div className="absolute inset-x-0 top-0 h-64 opacity-20">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
              </svg>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-64 opacity-20">
              <svg viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ transform: 'rotate(180deg)' }}>
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
              </svg>
            </div>
          </div>
          
          {/* Company name */}
          <div className="relative z-10 w-full max-w-md">
            <div className="flex items-center mb-24">
              <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-2">
                <span className="text-white text-lg font-bold">T</span>
              </div>
              <span className="font-semibold tracking-wide text-lg">Task Support</span>
            </div>
            
            {/* Welcome message */}
            <div className="text-center mb-16">
              <p className="text-xl mb-3 font-light tracking-wide">Create an account</p>
              <h1 className="text-6xl font-bold mb-8">JOIN US NOW</h1>
              <div className="w-16 h-1 bg-white mx-auto mb-8"></div>
              <p className="text-md opacity-90 max-w-xs mx-auto leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right side - Register form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-blue-500 mb-4">Create Account</h2>
              <p className="text-gray-500 text-md max-w-md mx-auto leading-relaxed">
                Join our community today and enjoy all the benefits of our service.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field */}
              <div className="transition-all duration-300 hover:shadow-md">
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  placeholder="Full Name"
                  className={`w-full p-4 border ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50`}
                  onChange={handleChange}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>
              
              {/* Email field */}
              <div className="transition-all duration-300 hover:shadow-md">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Email Address"
                  className={`w-full p-4 border ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50`}
                  onChange={handleChange}
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>
              
              {/* Password field */}
              <div className="relative transition-all duration-300 hover:shadow-md">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  placeholder="Create Password"
                  className={`w-full p-4 border ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50`}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? (
                    <EyeOff 
                      size={20} 
                      className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" 
                      onClick={() => setShowPassword(false)} 
                    />
                  ) : (
                    <Eye 
                      size={20} 
                      className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" 
                      onClick={() => setShowPassword(true)} 
                    />
                  )}
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              </div>
              
              {/* Confirm Password field */}
              <div className="relative transition-all duration-300 hover:shadow-md">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  placeholder="Confirm Password"
                  className={`w-full p-4 border ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-200"
                  } rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50`}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showConfirmPassword ? (
                    <EyeOff 
                      size={20} 
                      className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" 
                      onClick={() => setShowConfirmPassword(false)} 
                    />
                  ) : (
                    <Eye 
                      size={20} 
                      className="text-gray-400 cursor-pointer hover:text-blue-500 transition-colors" 
                      onClick={() => setShowConfirmPassword(true)} 
                    />
                  )}
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
              
              {/* Terms and conditions */}
              <div className="flex items-center mt-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-500">
                  I agree to the <a href="#" className="text-blue-500 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                </label>
              </div>
              
              {/* Register button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all font-medium text-center text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-6 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "REGISTER NOW"
                )}
              </button>
            </form>
            
            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <span 
                  className="text-blue-500 font-medium hover:underline cursor-pointer" 
                  onClick={() => navigate("/login")}
                >
                  Login here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;