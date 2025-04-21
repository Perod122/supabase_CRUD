import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { fLogic } from '../store/flogic'

function Register() {
    const {
        email,
        password,
        loading,
        setEmail,
        setPassword,
        handleSignUp
    } = fLogic();

    const onSubmit = (e) => {
        e.preventDefault();
        handleSignUp();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-600 via-yellow-300 to-green-600 px-4">
            <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md space-y-6">
                <h1 className="text-4xl font-bold text-center text-gray-900">Sign Up</h1>
                <p className="text-gray-600 text-center mb-6 text-lg">
                    Create a new account to get started.
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
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/" className="text-indigo-600 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register
