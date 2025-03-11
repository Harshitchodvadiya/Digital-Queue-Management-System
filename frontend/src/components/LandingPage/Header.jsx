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
                            src="https://alexharkness.com/wp-content/uploads/2020/06/logo-2.png"
                            className="mr-3 h-10"
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
                    
                    {/* Navigation Links */}
                    <div
                        className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1"
                        id="mobile-menu-2"
                    >
                        <ul className="flex flex-col mt-2 font-medium lg:flex-row lg:space-x-6">
                            {/* Home Link */}
                            <li>
                                <NavLink
                                    to="/"
                                    className={({isActive}) =>
                                        `block py-1.5 pr-3 pl-3 duration-200 ${isActive ? "text-blue-700" : "text-gray-700"} 
                                        border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                        hover:text-blue-700 lg:p-0`
                                    }
                                >
                                    Home
                                </NavLink>
                            </li>
                            
                            {/* About Link */}
                            <li>
                                <NavLink
                                    to="/about"
                                    className={({isActive}) =>
                                        `block py-1.5 pr-3 pl-3 duration-200 ${isActive ? "text-blue-700" : "text-gray-700"} 
                                        border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                        hover:text-blue-700 lg:p-0`
                                    }
                                >
                                    About
                                </NavLink>
                            </li>
                            
                            {/* Contact Us Link */}
                            <li>
                                <NavLink
                                    to="/contact"
                                    className={({isActive}) =>
                                        `block py-1.5 pr-3 pl-3 duration-200 ${isActive ? "text-blue-700" : "text-gray-700"} 
                                        border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 
                                        hover:text-blue-700 lg:p-0`
                                    }
                                >
                                    Contact Us
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </header>
    );
}
