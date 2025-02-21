'use client';

import { useState } from 'react';
// import { VehicleType } from '@/lib/types';

interface AvailabilitySectionProps {
  lots: string[];
}

export function AvailabilitySection({ lots }: AvailabilitySectionProps) {
  const [availability, setAvailability] = useState<Record<number, number> | null>(null);
  const [loading, setLoading] = useState(false);

  const checkAvailability = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const lot = formData.get('lot_name') as string;
    const type = formData.get('vehicle_type') as string;

    setLoading(true);
    try {
      const response = await fetch(`/api/availability/${lot}/${type}`);
      const data = await response.json();
      setAvailability(data.availability);
    } catch (error) {
      console.error('Error checking availability:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Check Availability</h2>
      <form onSubmit={checkAvailability} className="flex flex-wrap gap-4">
        <select
          name="lot_name"
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Lot</option>
          {lots.map(lot => (
            <option key={lot} value={lot}>{lot}</option>
          ))}
        </select>
        <select
          name="vehicle_type"
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select Vehicle Type</option>
          <option value="BIKE">Bike</option>
          <option value="CAR">Car</option>
          <option value="TRUCK">Truck</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   transform hover:-translate-y-0.5 transition-all duration-200 
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>

      {availability && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Available Spots:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(availability).map(([floor, spots]) => (
              <div key={floor} className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">Floor {floor}: {spots} spots</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}