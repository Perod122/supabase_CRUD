import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fLogic } from '../store/fLogic';
import { User, Mail, Phone, Lock, Eye, EyeOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Modal animation variants
const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", damping: 25, stiffness: 300 }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: 0.2 }
  }
};

// Modal backdrop animation
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

// Terms of Service Modal Component
const TermsOfServiceModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
              <motion.button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <h3 className="font-semibold text-lg">1. Introduction</h3>
              <p className="text-gray-700">Welcome to Shoppperod. These Terms of Service govern your use of our website and services. By accessing or using our services, you agree to be bound by these Terms.</p>
              
              <h3 className="font-semibold text-lg">2. User Accounts</h3>
              <p className="text-gray-700">When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account.</p>
              
              <h3 className="font-semibold text-lg">3. Purchases and Payments</h3>
              <p className="text-gray-700">When making a purchase, you agree to provide current, complete, and accurate purchase and account information. All payments must be made through our secure payment system.</p>
              
              <h3 className="font-semibold text-lg">4. Product Information</h3>
              <p className="text-gray-700">We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content on the site is accurate, complete, reliable, current, or error-free.</p>
              
              <h3 className="font-semibold text-lg">5. Shipping and Delivery</h3>
              <p className="text-gray-700">Delivery times may vary depending on the delivery location and other factors. We are not responsible for delays that are beyond our control.</p>
              
              <h3 className="font-semibold text-lg">6. Returns and Refunds</h3>
              <p className="text-gray-700">Products may be returned within 30 days of receipt for a full refund. Items must be unused and in their original packaging. Shipping costs for returns are the responsibility of the customer.</p>
              
              <h3 className="font-semibold text-lg">7. Intellectual Property</h3>
              <p className="text-gray-700">The Service and its original content, features, and functionality are and will remain the exclusive property of Shoppperod and its licensors.</p>
              
              <h3 className="font-semibold text-lg">8. Termination</h3>
              <p className="text-gray-700">We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
              
              <h3 className="font-semibold text-lg">9. Limitation of Liability</h3>
              <p className="text-gray-700">In no event shall Shoppperod, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.</p>
              
              <h3 className="font-semibold text-lg">10. Changes to Terms</h3>
              <p className="text-gray-700">We reserve the right, at our sole discretion, to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.</p>
            </div>
            <div className="px-6 py-4 border-t">
              <motion.button 
                className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                I Understand
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Privacy Policy Modal Component
const PrivacyPolicyModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
              <motion.button 
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <h3 className="font-semibold text-lg">1. Information We Collect</h3>
              <p className="text-gray-700">We collect personal information when you register an account, make a purchase, or interact with our services. This may include your name, email address, phone number, payment information, and other details necessary to provide our services.</p>
              
              <h3 className="font-semibold text-lg">2. How We Use Your Information</h3>
              <p className="text-gray-700">We use your personal information to process transactions, provide customer support, improve our services, and communicate with you about promotions, updates, and other information related to our products and services.</p>
              
              <h3 className="font-semibold text-lg">3. Information Sharing and Disclosure</h3>
              <p className="text-gray-700">We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who help us operate our business, such as payment processors, shipping companies, and marketing partners.</p>
              
              <h3 className="font-semibold text-lg">4. Data Security</h3>
              <p className="text-gray-700">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
              
              <h3 className="font-semibold text-lg">5. Cookies and Tracking Technologies</h3>
              <p className="text-gray-700">We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
              
              <h3 className="font-semibold text-lg">6. Third-Party Links</h3>
              <p className="text-gray-700">Our service may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.</p>
              
              <h3 className="font-semibold text-lg">7. Children's Privacy</h3>
              <p className="text-gray-700">Our services are not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and you learn that your child has provided us with personal information, please contact us.</p>
              
              <h3 className="font-semibold text-lg">8. Changes to This Privacy Policy</h3>
              <p className="text-gray-700">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.</p>
              
              <h3 className="font-semibold text-lg">9. Your Rights</h3>
              <p className="text-gray-700">Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data. Please contact us to exercise these rights.</p>
              
              <h3 className="font-semibold text-lg">10. Contact Us</h3>
              <p className="text-gray-700">If you have any questions about this Privacy Policy, please contact us at privacy@shoppperod.com.</p>
            </div>
            <div className="px-6 py-4 border-t">
              <motion.button 
                className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                I Understand
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function Register() {
  const {
    firstName,
    lastName,
    phone,
    gender,
    email,
    password,
    loading,
    setFirstName,
    setLastName,
    setPhone,
    setGender,
    setEmail,
    setPassword,
    handleSignUp
  } = fLogic();

  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const onSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Basic validation
    if (!firstName || !lastName || !phone || !gender || !email || !password) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!termsAccepted) {
      setFormError('You must accept the terms and conditions');
      return;
    }

    try {
      await handleSignUp();
    } catch (error) {
      setFormError(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Logo/Brand Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center"
        >
          <h1 className="text-3xl font-bold text-indigo-600">Shoppperod</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </motion.div>

        {/* Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-8 w-full"
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
            <p className="text-gray-500 text-sm mt-1">
              Join our community today
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {formError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6" 
                role="alert"
              >
                {formError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-5">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full pl-10 pr-3 py-3 border bg-white border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    aria-required="true"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full pl-10 pr-3 py-3 border bg-white border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(+63) 911 222 333"
                  className="w-full pl-10 pr-3 py-3 border bg-white border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full pl-3 pr-3 py-3 border bg-white border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-no-repeat bg-right-4"
                style={{ backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%208l3%203%203-3%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')", backgroundPosition: "right 0.75rem center" }}
                required
                aria-required="true"
              >
                <option value="" disabled defaultValue hidden>Select a Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Prefer not to say</option>
              </select>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-3 py-3  bg-white border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border bg-white border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  aria-required="true"
                />
                <motion.button 
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-600">
                  I agree to the{' '}
                  <motion.button
                    type="button" 
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                    onClick={() => setShowTermsModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Terms of Service
                  </motion.button>
                  {' '}and{' '}
                  <motion.button
                    type="button" 
                    className="text-indigo-600 hover:text-indigo-500 font-medium"
                    onClick={() => setShowPrivacyModal(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Privacy Policy
                  </motion.button>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <motion.button
                type="submit"
                className={`w-full flex justify-center items-center py-3 px-4 text-white font-medium rounded-lg transition ${
                  loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </motion.button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign in
                </Link>
              </motion.span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Terms of Service Modal */}
      <TermsOfServiceModal 
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal 
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </div>
  );
}

export default Register;