async function checkAvailability() {
  const form = document.getElementById("availabilityForm");
  const lot = form.lot_name.value;
  const vehicleType = form.vehicle_type.value;

  const response = await fetch(`/availability/${lot}/${vehicleType}`);
  const data = await response.json();

  let html = `<h3>Availability in ${data.lot} (${data.vehicle_type})</h3><table>`;
  html += "<tr><th>Floor</th><th>Available Spots</th></tr>";

  Object.entries(data.availability).forEach(([floor, spots]) => {
    html += `<tr><td>Floor ${floor}</td><td>${spots} spots</td></tr>`;
  });

  html += "</table>";
  document.getElementById("availabilityResults").innerHTML = html;
}

async function loadHistory() {
  const lot = document.getElementById("historyLot").value;
  if (!lot) return;

  const response = await fetch(`/history/${lot}`);
  const data = await response.json();

  let html = `<h3>History for ${lot}</h3><table>`;
  html +=
    "<tr><th>Registration</th><th>Entry Time</th><th>Exit Time</th><th>Amount Paid</th></tr>";

  data.history.forEach((activity) => {
    html += `<tr>
                    <td>${activity.registration}</td>
                    <td>${new Date(activity.entry_time).toLocaleString()}</td>
                    <td>${
                      activity.exit_time
                        ? new Date(activity.exit_time).toLocaleString()
                        : "N/A"
                    }</td>
                    <td>₹${activity.amount_paid.toFixed(2)}</td>
                </tr>`;
  });

  html += "</table>";
  document.getElementById("historyResults").innerHTML = html;
}

function showMessage(message, isSuccess) {
  const messageArea = document.getElementById("messageArea");
  const messageText = document.getElementById("messageText");
  messageArea.style.display = "block";
  messageArea.className = `alert ${
    isSuccess ? "alert-success" : "alert-danger"
  }`;
  messageText.textContent = message;
  // setTimeout(() => messageArea.style.display = 'none', 5000); // Hide after 5 seconds
}

async function handleCreateLot(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("/admin/create-lot", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    showMessage(data.message, data.success);
    if (data.success) {
      form.reset();
      // Refresh lots list without page reload
      await updateLotsList();
    }
  } catch (error) {
    showMessage("Error creating parking lot", false);
  }
  return false;
}

async function updateLotsList() {
  const response = await fetch("/dashboard");
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const lotSelects = doc.querySelectorAll('select[name="lot_name"]');
  const currentSelects = document.querySelectorAll('select[name="lot_name"]');
  currentSelects.forEach((select, index) => {
    select.innerHTML = lotSelects[index].innerHTML;
  });
}

// Handle Park Vehicle
async function handleParkVehicle(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("/operator/park", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    showMessage(data.message, data.success);
    if (data.success) {
      form.reset();
    }
  } catch (error) {
    showMessage("Error parking vehicle", false);
  }
}

// Handle Payment
async function handlePayment(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("/operator/payment", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    showMessage(data.message, data.success);
    if (data.success) {
      form.reset();
    }
  } catch (error) {
    showMessage("Error processing payment", false);
  }
}

// Handle Exit Vehicle
async function handleExit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  try {
    const response = await fetch("/operator/exit", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    showMessage(data.message, data.success);
    if (data.success) {
      form.reset();
    }
  } catch (error) {
    showMessage("Error exiting vehicle", false);
  }
}
async function handleLookup(event) {
  event.preventDefault();
  const reg_num = event.target.reg_num.value;

  try {
    const response = await fetch(`/vehicle-lookup/${reg_num}`);
    const data = await response.json();

    let html = "";
    if (data.found) {
      html = `
                            <div class="result-box">
                                <h3>Vehicle Found!</h3>
                                <p>Location: ${data.lot_name}</p>
                                <p>Floor: ${data.floor_id}, Spot: ${data.spot_id}</p>
                                <p>Entry Time: ${data.entry_time}</p>
                                <p>Payment Status: ${data.payment_status}</p>
                            </div>
                        `;
    } else {
      html = `<p class="not-found">Vehicle not found in any parking lot</p>`;
    }

    document.getElementById("lookupResults").innerHTML = html;
  } catch (error) {
    showMessage("Error looking up vehicle", false);
  }
}
