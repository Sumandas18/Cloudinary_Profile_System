import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface PostCardProps {
  post: {
    _id: string;
    blog_title: string;
    blog_content: string;
    blog_image: string;
    createdAt: string;
    blog_author: {
      _id: string;
      name: string;
      profile_image?: string;
    };
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005';

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const normalized = imagePath.replace(/\\/g, '/');
    return normalized.startsWith('/') ? `${API_URL}${normalized}` : `${API_URL}/${normalized}`;
  };

  const truncateContent = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 w-full bg-gray-200">
        <Image 
          src={getImageUrl(post.blog_image)} 
          alt={post.blog_title} 
          fill 
          className="object-cover"
        />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {post.blog_title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {truncateContent(post.blog_content, 120)}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {post.blog_author?.profile_image ? (
              <div className="relative h-8 w-8 rounded-full overflow-hidden">
                <Image src={getImageUrl(post.blog_author.profile_image)} alt={post.blog_author.name} fill className="object-cover" />
              </div>
            ) : (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                    {post.blog_author?.name?.charAt(0).toUpperCase() || '?'}
                </div>
            )}
            <div className="text-sm">
              <p className="text-gray-900 font-medium">{post.blog_author?.name || 'Unknown Author'}</p>
              <p className="text-gray-500 text-xs">
                {post.createdAt ? format(new Date(post.createdAt), 'MMM d, yyyy') : 'Recently'}
              </p>
            </div>
          </div>

          <Link
            href={`/posts/${post._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
