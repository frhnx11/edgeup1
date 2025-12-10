import { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Brain, Target, Users, X, Eye, EyeOff, CheckCircle, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import Spline from '@splinetool/react-spline';

function LoadingBackground() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-12 w-12 border-b-2 border-white"
      />
    </div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [splineError, setSplineError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (email.includes('@') && password.length >= 6) {
      if (role === 'admin' && email === 'admin@edgeup.ai' && password === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify({ name: 'Teacher', email, role: 'admin' }));
        navigate('/upsc/teacher/dashboard');
      } else if (email === 'admin@edgeup.ai') {
        // Admin user logging in as student - bypass onboarding
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('bypassOnboarding', 'true');
        localStorage.setItem('userData', JSON.stringify({ name: 'Demo User', email, role: 'student' }));
        navigate('/dashboard');
      } else if (role === 'student') {
        // Regular student - always go through goal setting
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify({ name: email.split('@')[0], email, role: 'student' }));

        // Navigate directly to quiz page
        navigate('/quiz');
      } else {
        setError('Invalid credentials');
        setIsLoading(false);
      }
    } else {
      setError('Invalid email or password');
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    const userData = { name, email, role };
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');

    // Navigate directly to quiz page
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Spline Background - Fixed to background */}
      <div className="fixed inset-0" style={{ zIndex: 0, pointerEvents: 'none' }}>
        <Suspense fallback={<LoadingBackground />}>
          {!splineError ? (
            <div style={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
              <Spline
                scene="https://prod.spline.design/tTZamMdAg0Olzas5/scene.splinecode"
                onError={() => setSplineError(true)}
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-brand-primary to-brand-secondary"
              style={{ pointerEvents: 'none' }}
            >
              {/* Animated background particles */}
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </Suspense>
      </div>

      {/* Main Content - Above background */}
      <div className="min-h-screen flex relative" style={{ zIndex: 10 }}>
        {/* Left side - Promo */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex lg:flex-1 text-white p-12 flex-col justify-between"
        >
        <div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="flex items-center gap-3 text-xl font-semibold"
          >
            <img
              src="/Logo.png"
              alt="Edgeup Logo"
              className="h-12 object-contain"
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-20"
          >
            <h2 className="text-4xl font-bold mb-6">Welcome to Your Learning Journey</h2>
            <p className="text-lg opacity-90">
              Personalized learning paths, AI-powered insights, and comprehensive study materials to help you achieve your goals.
            </p>
          </motion.div>
        </div>

        <div className="space-y-6">
          {[
            { icon: Brain, title: 'AI-Powered Learning', desc: 'Personalized study plans based on your learning style', delay: 0.7 },
            { icon: Target, title: 'Track Progress', desc: 'Monitor your performance with detailed analytics', delay: 0.8 },
            { icon: Users, title: 'Expert Mentorship', desc: 'Get guidance from experienced mentors', delay: 0.9 }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: feature.delay }}
              whileHover={{ x: 10 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="opacity-80 text-sm">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

        {/* Right side - Login/Signup Form */}
        <div className="flex-1 flex items-center justify-end pr-24 p-8">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl"
          >
          <div className="text-center mb-8">
            <motion.h2
              key={isLogin ? 'login' : 'signup'}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
            >
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </motion.h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin
                ? 'Sign in to continue your learning journey'
                : 'Join us to start your learning journey'}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2"
              >
                <span className="flex-1 text-red-600 dark:text-red-400">{error}</span>
                <button
                  onClick={() => setError(null)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
                className="space-y-6"
              >
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Login As
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: 'student', icon: GraduationCap, title: 'Student', subtitle: 'For learners' },
                      { value: 'admin', icon: Users, title: 'Teacher', subtitle: 'For educators' }
                    ].map((roleOption) => (
                      <motion.button
                        key={roleOption.value}
                        type="button"
                        onClick={() => setRole(roleOption.value as 'student' | 'admin')}
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          role === roleOption.value
                            ? 'border-brand-primary bg-brand-primary/5 shadow-lg'
                            : 'border-gray-200 dark:border-gray-700 hover:border-brand-secondary'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            role === roleOption.value
                              ? 'bg-brand-primary text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                          }`}>
                            <roleOption.icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-gray-900 dark:text-white">{roleOption.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{roleOption.subtitle}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 focus:ring-opacity-50 transition-all disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 focus:ring-opacity-50 transition-all disabled:opacity-50"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-4 rounded-lg hover:from-brand-secondary hover:to-brand-accent transition-all duration-300 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSignup}
                className="space-y-6"
              >
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 focus:ring-opacity-50 transition-all disabled:opacity-50"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 focus:ring-opacity-50 transition-all disabled:opacity-50"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 focus:ring-opacity-50 transition-all disabled:opacity-50"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Must be at least 6 characters long</p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-2 pr-10 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-brand-primary focus:ring focus:ring-brand-primary/20 focus:ring-opacity-50 transition-all disabled:opacity-50"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-3 px-4 rounded-lg hover:from-brand-secondary hover:to-brand-accent transition-all duration-300 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Toggle Form */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              disabled={isLoading}
              className="text-brand-primary hover:text-brand-secondary font-medium transition-colors disabled:opacity-50"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Demo Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-2">Demo Credentials:</p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              Email: admin@edgeup.ai<br />
              Password: admin123
            </p>
          </motion.div>
        </motion.div>
      </div>
      </div>
    </div>
  );
}
