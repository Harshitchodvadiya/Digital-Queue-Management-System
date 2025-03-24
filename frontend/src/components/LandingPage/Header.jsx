import React from 'react'
import {Link, NavLink} from 'react-router-dom';

export default function Header() {
    return (
        <header className="shadow sticky z-50 h-14">
            <nav className="border-gray-200 px-4 lg:px-6 py-1.5">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center">
                        <img
                            src="src\assets\qwaiting_logo.png"
                            className="mr-3 h-12"
                            alt="Logo"
                        />
                    </Link>
                    
                    {/* Sign In & Sign Up Buttons */}
                    <div className="flex items-center lg:order-2">
                        <Link
                            to="/login"
                            className="text-gray-800 hover:bg-blue-100 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-3 py-1.5 mr-2"
                        >   
                            Sign in
                        </Link>
                        <Link
                            to="/register"
                            className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-3 py-1.5"
                        >
                            Sign Up
                        </Link>
                    </div>

                </div>
            </nav>
        </header>
    );
}
