"use client"
import React, { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';
import Image from 'next/image';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005';

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const normalized = imagePath.replace(/\\/g, '/');
    const cleanPath = normalized.startsWith('/') ? normalized.substring(1) : normalized;
    return `${API_URL}/${cleanPath}`;
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center text-xl font-bold text-blue-600">
              BlogApp
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link href="/posts/create" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Create Post
                </Link>
                <Link href="/profile" className="flex items-center space-x-2">
                  <span className="text-gray-700 text-sm font-medium">{user.name}</span>
                  {user.profile_image ? (
                     <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                        <Image src={getImageUrl(user.profile_image)} alt={user.name} fill className="object-cover" />
                     </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link href="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
