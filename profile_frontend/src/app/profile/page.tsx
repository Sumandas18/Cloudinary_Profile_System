"use client"
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProfileCard from '../../components/ProfileCard';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Profile</h1>
        {user && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <ProfileCard user={user} isOwner={true} />
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
