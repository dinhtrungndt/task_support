import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../../contexts/start/AuthContext.js";
import { login } from "../../services/user.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const hours = new Date().getHours();
      let greetingText = "";

      if (hours >= 5 && hours < 12) {
        greetingText = "sáng";
      } else if (hours >= 12 && hours < 18) {
        greetingText = "chiều";
      } else {
        greetingText = "tối";
      }

      setGreeting(greetingText);
    };

    getTimeBasedGreeting();

    const intervalId = setInterval(getTimeBasedGreeting, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await login(form);

      if (user) {
        auth?.loginUser(user);
        toast.success(`Chào mừng, ${user.name}!`);
        navigate("/");
      } else {
        toast.error("Email hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Xử lý các loại lỗi cụ thể
      if (error.response) {
        const { status, data } = error.response;

        if (status === 401) {
          toast.error("Email hoặc mật khẩu không đúng!");
        } else if (status === 429) {
          toast.error(
            "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau!"
          );
        } else if (data && data.message) {
          toast.error(data.message);
        } else {
          toast.error("Đăng nhập thất bại, vui lòng thử lại!");
        }
      } else {
        toast.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-6xl h-[650px] shadow-2xl rounded-lg overflow-hidden flex bg-white border border-gray-200">
        {/* Left side - Blue background with welcome message */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-blue-500 to-blue-600 text-white p-12 flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500">
            {/* Grid background */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            ></div>

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
              <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                style={{ transform: "rotate(180deg)" }}
              >
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
              <span className="font-semibold tracking-wide text-lg">
                Hỗ Trợ Quản Lý
              </span>
            </div>

            {/* Welcome message */}
            <div className="text-center mb-16">
              <p className="text-xl mb-3 font-light tracking-wide">
                Chào buổi {greeting}
              </p>
              <h1 className="text-5xl font-bold mb-8">PAGES SUPPPORT !</h1>
              <div className="w-16 h-1 bg-white mx-auto mb-8"></div>
              <p className="text-md opacity-90 max-w-xs mx-auto leading-relaxed">
                Hệ thống hỗ trợ quản lý công việc giúp doanh nghiệp của bạn vận
                hành hiệu quả hơn. Đăng nhập để tiếp tục công việc của bạn.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 flex justify-center items-center p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-blue-500 mb-4">
                Đăng Nhập
              </h2>
              <p className="text-gray-500 text-md max-w-md mx-auto leading-relaxed">
                Chào mừng bạn đến với hệ thống quản lý doanh nghiệp. Vui lòng
                đăng nhập để tiếp tục sử dụng dịch vụ.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email field */}
              <div className="transition-all duration-300 hover:shadow-md">
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  placeholder="Địa chỉ email"
                  className="w-full p-4 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password field */}
              <div className="relative transition-all duration-300 hover:shadow-md">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  placeholder="Mật khẩu"
                  className="w-full p-4 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-50"
                  required
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
              </div>

              {/* Remember me and Already a member */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={() => setKeepSignedIn(!keepSignedIn)}
                    className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-500"
                  >
                    Giữ đăng nhập
                  </label>
                </div>
                <div>
                  <span
                    className="text-blue-500 text-sm cursor-pointer hover:underline font-medium"
                    onClick={() => navigate("/register")}
                  >
                    Chưa có tài khoản?
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all font-medium text-center text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "ĐĂNG NHẬP"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
