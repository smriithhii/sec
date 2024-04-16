import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import googleLogo from '../assets/google-logo.svg';
import fbLogo from '../assets/facebook-log.svg';
import zxcvbn from 'zxcvbn'; // Importing zxcvbn for password strength checking

export default function Login() {
    const [ErrorMessage, setErrorMessage] = useState('');
    const { signUpWithGmail, login } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';

    // Function to handle login with email and password
    const handleLogin = (event) => {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;

        // Perform client-side validation for password strength
        const strength = checkPasswordStrength(password);
        if (strength < 3) {
            setErrorMessage('Password is weak. Please use a stronger password.');
            return;
        }

        // Send login request to the server for authentication
        login(email, password)
            .then((result) => {
                // If login is successful, redirect the user to the desired location
                const user = result.user;
                alert('Login successful!');
                navigate(from, { replace: true });
            })
            .catch((error) => {
                const errorMessage = error.message;
                setErrorMessage(errorMessage);
            });
    };

    // Function to validate password strength using zxcvbn library
    const checkPasswordStrength = (password) => {
        const result = zxcvbn(password);
        return result.score; // Returns a score from 0 to 4 indicating password strength
    };

    // Function to handle registration with Google
    const handleRegister = () => {
        signUpWithGmail()
            .then((result) => {
                const user = result.user;
                navigate(from, { replace: true });
            })
            .catch((error) => console.log(error));
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <div className="max-w-md mx-auto">
                        <div>
                            <h1 className="text-3xl font-semibold">Please Login to Dashboard</h1>
                        </div>
                        <div className="divide-y divide-gray-200">
                            <form onSubmit={handleLogin} className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                        placeholder="Email address"
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                        placeholder="Password"
                                        required
                                    />
                                </div>
                                <div>
                                    <p>{ErrorMessage ? <span className="text-blue-500 text-sm">{ErrorMessage}</span> : ''}</p>
                                    <p className="text-base mt-1">
                                        If you haven't an account. Please create here{' '}
                                        <Link to="/create-user" className="underline text-blue-600">
                                            Sign Up
                                        </Link>
                                    </p>
                                </div>
                                <div className="relative">
                                    <button type="submit" className="bg-blue-500 text-white rounded px-6 py-1">
                                        Login
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* social login */}
                    <div>
                        <hr />
                        <div className="flex w-full items-center flex-col mt-5 gap-3">
                            <button onClick={handleRegister} className="block">
                                {' '}
                                <img src={googleLogo} alt="" className="w-12 h-12 inline-block" />Log in with Google
                            </button>
                            <button>
                                {' '}
                                <img src={fbLogo} alt="" className="w-10 h-10 inline-block mr-1" />Log in with Facebook
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
