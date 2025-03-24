import { useContext, useState } from "react";
import { toast } from "react-toastify";
import React from "react";
import { Eye } from "lucide-react";
import { AuthContext } from "../../contexts/start/AuthContext.js";
import { login } from "../../services/user.js";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

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
        toast.error("Thông tin không đúng!");
      }
    } catch (error) {
      toast.error("Đăng nhập thất bại, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br to-indigo-100">
      <div className="w-full max-w-md bg-slate-400 p-2 shadow-md rounded-lg border border-gray-200">
        <div className="bg-white p-8 shadow-lg rounded-xl border border-gray-100">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Đăng Nhập</h1>
            <p className="text-gray-500 mt-2">Đăng nhập để truy cập vào tài khoản của bạn</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium" htmlFor="email">
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
                  placeholder="Email của bạn"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label className="text-gray-700 font-medium" htmlFor="password">
                  Mật khẩu
                </label>
                <a href="#" className="text-xs text-blue-600 hover:text-blue-800 transition-all">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu của bạn"
                  className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                    onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <Eye size={18} className="text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                Ghi nhớ đăng nhập
              </label>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
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
                "Đăng nhập"
              )}
            </button>
        
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Bạn chưa có tài khoản?{" "}
              <span 
                className="text-blue-600 font-medium hover:text-blue-800 cursor-pointer transition-all" 
                onClick={() => navigate("/register")}
              >
                Đăng ký ngay
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;