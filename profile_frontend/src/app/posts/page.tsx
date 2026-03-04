import { redirect } from 'next/navigation';

export default function PostsPage() {
  // Redirect to dashboard where posts are actually displayed
  redirect('/dashboard');
}
