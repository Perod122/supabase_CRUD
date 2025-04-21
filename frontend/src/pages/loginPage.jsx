import { useEffect } from 'react';
import { fLogic } from '../store/flogic';
import { Link } from 'react-router-dom'; // Make sure you're using React Router

function LoginPage() {
    const {
        email,
        password,
        loading,
        setEmail,
        setPassword,
        handleSignIn
    } = fLogic();

    const onSubmit = (e) => {
        e.preventDefault();
        handleSignIn();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-green-500 to-white px-4">
          <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md space-y-6">
            <h1 className="text-4xl font-bold text-center text-gray-900">Sign In</h1>
            <p className="text-gray-600 text-center mb-6 text-lg">
              Welcome back! Please log in to your account.
            </p>
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email"
                  className="w-full border bg-white text-gray-600 border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  className="w-full border bg-white text-gray-600 border-gray-300 p-4 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className={`w-full py-3 text-white font-semibold rounded-lg transition ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Logging In...' : 'Log In'}
                </button>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Don’t have an account?{' '}
                  <Link to="/signup" className="text-indigo-600 hover:underline">
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      );
      
}

export default LoginPage;
