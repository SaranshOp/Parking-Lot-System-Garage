'use client';

import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/types';

export default function Home() {
  const router = useRouter();

  const selectRole = async (role: UserRole) => {
    try {
      await fetch('/api/select-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error setting role:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-[90%]">
        <h3 className="text-2xl font-semibold text-gray-800 mb-8 text-center">
          Welcome to Parking Management
        </h3>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => selectRole(UserRole.ADMIN)}
            className="w-full py-3 px-6 rounded-lg bg-blue-500 text-white font-medium 
                     hover:bg-blue-600 transform hover:-translate-y-0.5 transition-all"
          >
            Admin Access
          </button>
          <button
            onClick={() => selectRole(UserRole.OPERATOR)}
            className="w-full py-3 px-6 rounded-lg bg-green-500 text-white font-medium 
                     hover:bg-green-600 transform hover:-translate-y-0.5 transition-all"
          >
            Operator Access
          </button>
          <button
            onClick={() => selectRole(UserRole.USER)}
            className="w-full py-3 px-6 rounded-lg bg-red-500 text-white font-medium 
                     hover:bg-red-600 transform hover:-translate-y-0.5 transition-all"
          >
            User Access
          </button>
        </div>
      </div>
    </div>
  );
}