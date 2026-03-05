import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthProvider } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Profile System",
  description: "User profile frontend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
