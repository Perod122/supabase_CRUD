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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center mb-4 text-gray-900">Sign In</h1>
                <p className="text-gray-600 text-center mb-6">
                    Welcome back! Please log in to your account.
                </p>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="text"
                        placeholder="Email"
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        type="submit"
                        className={`w-full py-3 text-white font-semibold rounded-md transition ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Logging In...' : 'Log In'}
                    </button>
                    <p className="text-center">
                        Don’t have an account?{' '}
                        <Link to="/Signup" className="text-blue-500 hover:underline">
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
