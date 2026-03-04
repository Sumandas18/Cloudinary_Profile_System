"use client"
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/authService';
import { AuthContext } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function EditProfilePage() {
  const { user, updateUser, logout } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [about, setAbout] = useState('');
  const [image, setImage] = useState<File | null>(null);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAbout(user.about || '');
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user._id) return;
    
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (about) formData.append('about', about);
      if (image) formData.append('profile_image', image);

      const response = await authService.updateProfile(user._id, formData);
      if (response && response.user) {
         updateUser(response.user);
      }
      router.push('/profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !user._id) return;
    
    if (!confirm('Are you absolutely sure you want to permanently delete your account? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await authService.deleteProfile(user._id);
      logout();
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 focus:outline-none text-gray-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly title="Email cannot be changed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="about">
                  About
                </label>
                <textarea
                  id="about"
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="profile_image">
                  Profile Image
                </label>
                <input
                  id="profile_image"
                  type="file"
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-8">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={isDeleting || loading}
                className="py-2 px-4 border border-red-200 rounded-md shadow-sm text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 transition"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
              
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || isDeleting}
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
