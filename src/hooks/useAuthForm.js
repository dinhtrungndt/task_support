import { useState } from 'react';
import { sanitizeInput, isValidEmail, checkPasswordStrength } from '../utils/securityUtils';

export const useAuthForm = (initialState, validateFn) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Lọc dữ liệu đầu vào để ngăn XSS
    const sanitizedValue = name === 'password' || name === 'confirmPassword' 
      ? value // Không cần làm sạch mật khẩu
      : sanitizeInput(value);
    
    setForm({ ...form, [name]: sanitizedValue });
    
    // Đánh dấu trường đã được chạm vào
    if (!touched[name]) {
      setTouched({ ...touched, [name]: true });
    }
    
    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  // Xử lý blur (mất focus) để validate
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    
    // Validate khi blur
    if (validateFn) {
      const fieldErrors = validateFn({ [name]: form[name] });
      setErrors({ ...errors, ...fieldErrors });
    }
  };

  // Validate toàn bộ form
  const validateForm = () => {
    if (validateFn) {
      const formErrors = validateFn(form);
      setErrors(formErrors);
      return Object.keys(formErrors).length === 0;
    }
    return true;
  };

  // Xử lý submit
  const handleSubmit = async (submitFn) => {
    setIsSubmitting(true);
    
    // Đánh dấu tất cả các trường là đã chạm vào
    const allTouched = Object.keys(form).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate trước khi submit
    const isValid = validateForm();
    
    if (isValid) {
      try {
        await submitFn(form);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  };
  
  // Kiểm tra xem trường có lỗi và đã được chạm vào hay không
  const hasError = (fieldName) => {
    return touched[fieldName] && errors[fieldName];
  };

  return {
    form,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    hasError,
    setForm,
    setErrors
  };
};