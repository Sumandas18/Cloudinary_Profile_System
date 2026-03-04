import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProfileCardProps {
  user: {
    name: string;
    email: string;
    about?: string;
    profile_image?: string;
  };
  isOwner?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, isOwner }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005';

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const normalized = imagePath.replace(/\\/g, '/');
    const cleanPath = normalized.startsWith('/') ? normalized.substring(1) : normalized;
    return `${API_URL}/${cleanPath}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6 md:p-8 flex flex-col items-center">
      <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4 border-4 border-blue-50">
        {user.profile_image ? (
          <Image
            src={getImageUrl(user.profile_image)}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
      <p className="text-gray-500 mb-4">{user.email}</p>
      
      {user.about && (
        <div className="mt-4 text-center max-w-md">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">About</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{user.about}</p>
        </div>
      )}

      {isOwner && (
        <div className="mt-6">
          <Link
            href="/profile/edit"
            className="inline-flex items-center px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Edit Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
