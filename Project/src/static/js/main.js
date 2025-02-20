document.addEventListener("DOMContentLoaded", () => {
  console.log("Parking Lot System loaded");
});

document.getElementById("parkForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8000/park", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registration_number: document.getElementById("regNumber").value,
        vehicle_type: document.getElementById("vehicleType").value,
      }),
    });
    const data = await response.json();
    alert(data.message);
    updateStatus();
  } catch (error) {
    alert("Error: " + error.message);
  }
});

async function updateStatus() {
  try {
    const response = await fetch("http://localhost:8000/status");
    const data = await response.json();
    document.getElementById("statusDisplay").innerHTML = `
            <p>Available Spots: ${JSON.stringify(data.available_spots)}</p>
            <p>Is Full: ${data.is_full}</p>
        `;
  } catch (error) {
    console.error("Error fetching status:", error);
  }
}

// Update status every 30 seconds
setInterval(updateStatus, 30000);
updateStatus();
