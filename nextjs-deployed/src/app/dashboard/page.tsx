'use client';

import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { OperatorSection } from '@/components/OperatorSection';
import { AvailabilitySection } from '@/components/AvailabilitySection';
import { AdminHistorySection } from '@/components/AdminHistorySection';
import { VehicleLookupSection } from '@/components/VehicleLookupSection';

export default function Dashboard() {
  const [role, setRole] = useState<UserRole>(UserRole.USER);
  const [lots, setLots] = useState<string[]>([]);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const response = await fetch('/api');
      const data = await response.json();
      setRole(data.role || UserRole.USER);
      setLots(data.lots);
    } catch (error) {
      console.error('Error fetching initial data:', error);

    }
  };

  const showMessage = (text: string, success: boolean) => {
    setMessage({ text, success });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleCreateLot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/admin/create-lot', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.get('name'),
          floors: Number(formData.get('floors')),
          spots: Number(formData.get('spots'))
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      showMessage(data.message, data.success);
      if (data.success) {
        (e.target as HTMLFormElement).reset();
        fetchInitialData(); // Refresh lots list
      }
    } catch (error) {
      showMessage('Error creating parking lot', false);
      console.error('Error creating parking lot:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-5">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-blue-500 font-semibold">Logged in as: {role}</span>
            </div>
            <button
              onClick={() => router.push('/')}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Switch Role
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">
            Parking Management System - {role} Dashboard
          </h1>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.success ? 'bg-green-100 border-l-4 border-green-500 text-green-700' 
                          : 'bg-red-100 border-l-4 border-red-500 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Role-based sections */}
        {role === UserRole.ADMIN && (
          <>
            {/* Admin Section - Create Lot */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create New Parking Lot</h2>
              <form onSubmit={handleCreateLot} className="flex flex-wrap gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Lot Name"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  name="floors"
                  min="1"
                  placeholder="Floors"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  name="spots"
                  min="1"
                  placeholder="Spots per Floor"
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                           transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Create Lot
                </button>
              </form>
            </div>
            
            {/* Admin gets operator section */}
            <OperatorSection lots={lots} showMessage={showMessage} />

                        {/* Vehicle Lookup Section */}
                        <VehicleLookupSection showMessage={showMessage} />
            
            {/* Admin gets availability section */}
            <AvailabilitySection lots={lots} />
            
            {/* Admin gets history section */}
            <AdminHistorySection lots={lots} />
          </>
        )}

        {role === UserRole.OPERATOR && (
          <>
            {/* Vehicle Lookup Section */}
            <VehicleLookupSection showMessage={showMessage} />
            
            {/* Existing Sections */}
            <OperatorSection lots={lots} showMessage={showMessage} />
            <AvailabilitySection lots={lots} />
          </>
        )}

        {role === UserRole.USER && (
          <AvailabilitySection lots={lots} />
        )}
      </div>
    </div>
  );
  
}