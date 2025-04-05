// Làm sạch văn bản đầu vào để ngăn XSS
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  };
  
  // Kiểm tra định dạng email
  export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  // Kiểm tra độ mạnh của mật khẩu
  export const checkPasswordStrength = (password) => {
    let strength = 0;
    
    // Độ dài tối thiểu 8 ký tự
    if (password.length >= 8) strength += 1;
    
    // Chứa chữ hoa và chữ thường
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength += 1;
    
    // Chứa số
    if (/[0-9]/.test(password)) strength += 1;
    
    // Chứa ký tự đặc biệt
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return {
      score: strength, // 0-4
      isStrong: strength >= 3,
      feedback: [
        strength < 1 ? 'Mật khẩu phải có ít nhất 8 ký tự' : null,
        !/[A-Z]/.test(password) || !/[a-z]/.test(password) ? 'Mật khẩu nên chứa cả chữ hoa và chữ thường' : null,
        !/[0-9]/.test(password) ? 'Mật khẩu nên chứa ít nhất một số' : null,
        !/[^A-Za-z0-9]/.test(password) ? 'Mật khẩu nên chứa ít nhất một ký tự đặc biệt' : null
      ].filter(Boolean)
    };
  };