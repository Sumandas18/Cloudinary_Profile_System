"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import { AuthContext } from '../../../context/AuthContext';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { postService } from '../../../services/postService';

export default function SinglePostPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4005';

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const normalized = imagePath.replace(/\\/g, '/');
    const cleanPath = normalized.startsWith('/') ? normalized.substring(1) : normalized;
    return `${API_URL}/${cleanPath}`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      if (!params || !params.id) return;
      
      try {
        const data = await postService.getSinglePost(params.id as string);
        if (data.data) {
          setPost(data.data);
        } else if (data.post) {
          setPost(data.post);
        } else {
          setPost(data);
        }
      } catch (err) {
        setError('Failed to load post. It may have been deleted or does not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params]);

  const handleDelete = async () => {
    if (!post || !post._id) return;
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    setIsDeleting(true);
    try {
      await postService.deletePost(post._id);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete post');
      setIsDeleting(false);
    }
  };

  const isAuthor = user && post && post.blog_author && user._id === post.blog_author._id;

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => router.back()}
          className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center">{error}</div>
        ) : !post ? (
          <div className="text-center py-20">Post not found</div>
        ) : (
          <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="relative h-64 sm:h-80 md:h-96 w-full bg-gray-100">
              <Image 
                src={getImageUrl(post.blog_image)} 
                alt={post.blog_title} 
                fill 
                className="object-cover"
                priority
              />
            </div>
            
            <div className="p-8 md:p-12">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                {post.blog_title}
              </h1>
              
              <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
                {post.blog_author?.profile_image ? (
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-gray-200">
                    <Image src={getImageUrl(post.blog_author.profile_image)} alt={post.blog_author.name} fill className="object-cover" />
                  </div>
                ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-bold border border-blue-200">
                        {post.blog_author?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                )}
                <div>
                  <p className="text-gray-900 font-medium text-lg">{post.blog_author?.name || 'Unknown Author'}</p>
                  <p className="text-gray-500 text-sm">
                    {post.createdAt ? format(new Date(post.createdAt), 'MMMM d, yyyy') : 'Recently'} 
                  </p>
                </div>
                
                {isAuthor && (
                  <div className="ml-auto flex space-x-3">
                    <Link 
                      href={`/posts/edit/${post._id}`}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md text-sm font-medium hover:bg-blue-100 transition"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>

              <div className="prose prose-blue max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                {post.blog_content}
              </div>
            </div>
          </article>
        )}
      </div>
    </ProtectedRoute>
  );
}
