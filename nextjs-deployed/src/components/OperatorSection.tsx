'use client';

interface OperatorSectionProps {
  lots: string[];
  showMessage: (message: string, success: boolean) => void;
}

export function OperatorSection({ lots, showMessage }: OperatorSectionProps) {
  const handleParkVehicle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/operator/park', {
        method: 'POST',
        body: JSON.stringify({
          lot_name: formData.get('lot_name'),
          reg_num: formData.get('reg_num'),
          vehicle_type: formData.get('vehicle_type')
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      showMessage(data.message, data.success);
      if (data.success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch (_error) {
      showMessage('_error parking vehicle', false);
      console.error(_error);
    }
  };

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/operator/payment', {
        method: 'POST',
        body: JSON.stringify({
          lot_name: formData.get('lot_name'),
          reg_num: formData.get('reg_num')
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      showMessage(data.message, data.success);
      if (data.success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch (_error) {
      showMessage('_error processing payment', false);
      console.error(_error);
    }
  };

  const handleExit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/operator/exit', {
        method: 'POST',
        body: JSON.stringify({
          lot_name: formData.get('lot_name'),
          reg_num: formData.get('reg_num')
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      showMessage(data.message, data.success);
      if (data.success) {
        (e.target as HTMLFormElement).reset();
      }
    } catch (_error) {
      showMessage('_error exiting vehicle', false);
      console.error(_error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Park Vehicle Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Park Vehicle</h2>
        <form onSubmit={handleParkVehicle} className="flex flex-wrap gap-4">
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
          <input
            type="text"
            name="reg_num"
            placeholder="Registration Number"
            required
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
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
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                     transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Park Vehicle
          </button>
        </form>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Process Payment</h2>
        <form onSubmit={handlePayment} className="flex flex-wrap gap-4">
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
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 
                     transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Process Payment
          </button>
        </form>
      </div>

      {/* Exit Vehicle Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Exit Vehicle</h2>
        <form onSubmit={handleExit} className="flex flex-wrap gap-4">
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
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 
                     transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Exit Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}