import { useState, useRef, useEffect } from 'react';
import './Login.css';

type UserRole = 'student' | 'teacher' | 'parent' | 'management' | 'admin';
type FormMode = 'login' | 'signup';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

interface LoginProps {
  onLogin: (email: string, role: UserRole) => void;
  onBack?: () => void;
}

interface RoleOption {
  value: UserRole;
  icon: string;
  title: string;
  subtitle: string;
}

const roleOptions: RoleOption[] = [
  { value: 'student', icon: 'fa-graduation-cap', title: 'Student', subtitle: 'For learners' },
  { value: 'teacher', icon: 'fa-chalkboard-teacher', title: 'Faculty', subtitle: 'For professors' },
  { value: 'parent', icon: 'fa-users', title: 'Guardian', subtitle: 'For sponsors' },
  { value: 'management', icon: 'fa-briefcase', title: 'Management', subtitle: 'For college admin' },
  { value: 'admin', icon: 'fa-user-shield', title: 'Admin', subtitle: 'Platform staff' }
];

const Login = ({ onLogin, onBack }: LoginProps) => {
  const [mode, setMode] = useState<FormMode>('login');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleRoleChange = (role: UserRole) => {
    setFormData({ ...formData, role });
    setIsRoleDropdownOpen(false);
  };

  const toggleRoleDropdown = () => {
    setIsRoleDropdownOpen(!isRoleDropdownOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    // Clear form when switching modes
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student'
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === 'signup') {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Sign up attempt:', formData);
      alert(`Sign up successful!\nWelcome ${formData.fullName}!`);
      // After signup, automatically log in
      onLogin(formData.email, formData.role);
    } else {
      console.log('Login attempt:', formData);
      // Navigate to dashboard
      onLogin(formData.email, formData.role);
    }
  };

  return (
    <div className="container">
      {/* Left Section */}
      <div className="left-section">
        <div>
          {/* Logo */}
          <div className="logo">
            <img src="/Asset 3.png" alt="EdgeUp Logo" />
          </div>

          {/* Hero Content */}
          <div className="hero-content">
            <h1>Welcome to Your Learning Journey</h1>
            <p>
              Personalized learning paths, AI-powered insights, and comprehensive study materials to help you achieve your goals.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="features">
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-brain"></i>
            </div>
            <div className="feature-content">
              <h3>AI-Powered Learning</h3>
              <p>Personalized study plans based on your learning style</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="feature-content">
              <h3>Track Progress</h3>
              <p>Monitor your performance with detailed analytics</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="feature-content">
              <h3>Expert Mentorship</h3>
              <p>Get guidance from experienced mentors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="login-card">
          {/* Back Button */}
          {onBack && (
            <button className="back-to-home" onClick={onBack}>
              <i className="fas fa-arrow-left"></i> Back to Home
            </button>
          )}

          {/* Header */}
          <div className="login-header">
            <h2>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p>
              {mode === 'login'
                ? 'Sign in to continue your learning journey'
                : 'Join us to start your learning journey'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Login/Signup As */}
            <div className="login-as">
              <label>{mode === 'login' ? 'Login As' : 'Sign Up As'}</label>
              <div className="role-dropdown" ref={dropdownRef}>
                <div className="role-dropdown-selected" onClick={toggleRoleDropdown}>
                  <div className="role-icon">
                    <i className={`fas ${roleOptions.find(r => r.value === formData.role)?.icon}`}></i>
                  </div>
                  <div className="role-info">
                    <h4>{roleOptions.find(r => r.value === formData.role)?.title}</h4>
                    <p>{roleOptions.find(r => r.value === formData.role)?.subtitle}</p>
                  </div>
                  <i className={`fas fa-chevron-down dropdown-arrow ${isRoleDropdownOpen ? 'open' : ''}`}></i>
                </div>

                {isRoleDropdownOpen && (
                  <div className="role-dropdown-menu">
                    {roleOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`role-dropdown-item ${formData.role === option.value ? 'selected' : ''}`}
                        onClick={() => handleRoleChange(option.value)}
                      >
                        <div className="role-icon">
                          <i className={`fas ${option.icon}`}></i>
                        </div>
                        <div className="role-info">
                          <h4>{option.title}</h4>
                          <p>{option.subtitle}</p>
                        </div>
                        {formData.role === option.value && (
                          <i className="fas fa-check check-icon"></i>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Full Name Field - Only for Sign Up */}
            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <span className="toggle-password" onClick={togglePasswordVisibility}>
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>

            {/* Confirm Password Field - Only for Sign Up */}
            {mode === 'signup' && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-field">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <span className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="sign-in-btn">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>

            {/* Toggle Mode Link */}
            <div className="sign-up-link">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>
                    Sign up
                  </a>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>
                    Sign in
                  </a>
                </>
              )}
            </div>

            {/* Demo Credentials - Only for Login */}
            {mode === 'login' && (
              <div className="demo-credentials">
                <h4>Demo Credentials:</h4>
                <p>Email: admin@edgeup.ai</p>
                <p>Password: admin123</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
