'use client';

interface VehicleLookupSectionProps {
  showMessage: (message: string, success: boolean) => void;
}

export function VehicleLookupSection({ showMessage }: VehicleLookupSectionProps) {
  const handleLookup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const reg_num = formData.get('reg_num') as string;
    
    try {
      const response = await fetch(`/api/vehicle-lookup/${reg_num}`);
      const data = await response.json();
      
      let html = '';
      if (data.found) {
        html = `
          <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 class="text-lg font-semibold text-green-600 mb-2">Vehicle Found!</h3>
            <p class="text-gray-700">Location: ${data.lot_name}</p>
            <p class="text-gray-700">Floor: ${data.floor_id}, Spot: ${data.spot_id}</p>
            <p class="text-gray-700">Entry Time: ${data.entry_time}</p>
            <p class="text-gray-700">Payment Status: ${data.payment_status}</p>
          </div>
        `;
      } else {
        html = `<p class="text-red-500">Vehicle not found in any parking lot</p>`;
      }
      
      const resultsElement = document.getElementById('lookupResults');
      if (resultsElement) {
        resultsElement.innerHTML = html;
      }
    } catch (error) {
      showMessage('Error looking up vehicle', false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Lookup</h2>
      <form onSubmit={handleLookup} className="flex flex-wrap gap-4">
        <input
          type="text"
          name="reg_num"
          placeholder="Registration Number"
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                   transform hover:-translate-y-0.5 transition-all duration-200"
        >
          Lookup Vehicle
        </button>
      </form>
      <div id="lookupResults" className="mt-4"></div>
    </div>
  );
}