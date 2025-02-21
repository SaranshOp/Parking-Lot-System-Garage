'use client';

import { useState, useEffect } from 'react';
import { ParkingActivity } from '@/lib/types';

interface AdminHistorySectionProps {
  lots: string[];
}

export function AdminHistorySection({ lots }: AdminHistorySectionProps) {
  const [history, setHistory] = useState<ParkingActivity[]>([]);
  const [selectedLot, setSelectedLot] = useState<string>('');

  useEffect(() => {
    if (selectedLot) {
      fetchHistory(selectedLot);
    }
  }, [selectedLot]);

  const fetchHistory = async (lot: string) => {
    try {
      const response = await fetch(`/api/history/${lot}`);
      const data = await response.json();
      setHistory(data.history);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Parking History</h2>
      <select
        value={selectedLot}
        onChange={(e) => setSelectedLot(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-6"
      >
        <option value="">Select Lot</option>
        {lots.map(lot => (
          <option key={lot} value={lot}>{lot}</option>
        ))}
      </select>

      {history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exit Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Paid
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {history.map((activity, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {activity.registration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(activity.entry_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {activity.exit_time ? new Date(activity.exit_time).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${activity.amount_paid.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedLot && history.length === 0 && (
        <p className="text-gray-500 text-center py-4">No parking history available</p>
      )}
    </div>
  );
}