# 🚘 Parking Management System (Project 2)

![Parking Management System](https://pplx-res.cloudinary.com/image/upload/v1740139851/user_uploads/JNSrUtBItbDPAYE/image.jpg)

## 📖 Overview

The **Parking Management System** is a feature-rich web application designed to manage parking lots efficiently. Built using **FastAPI** and a simple **HTML/JavaScript frontend**, this project is the second iteration in a series of parking management systems. It introduces advanced features such as role-based access control, real-time vehicle tracking, and dynamic user interactions.

This project builds upon the foundational concepts of **Project 1**, which focused on object-oriented programming principles and iterative experimentation. **Project 2** enhances functionality with a user-friendly UI and robust backend logic.

---

## 🚀 Key Features

### 🎭 Role-Based Access Control

The system supports three distinct roles:

1. **Admin**:
   - Create new parking lots.
   - View parking history for any lot.
   - Access all operator functionalities.
2. **Operator**:
   - Park vehicles in available spots.
   - Process payments for parked vehicles.
   - Exit vehicles after payment is completed.
3. **User**:
   - Check parking availability by lot and vehicle type.
   - Lookup vehicle location by registration number.

---

### 🏗️ Parking Lot Management

- **Create Parking Lots**: Admins can create parking lots with specified floors and spots per floor.
- **Dynamic Updates**: Newly created lots are dynamically updated in the UI without page reloads.

---

### 🚘 Vehicle Operations

1. **Park Vehicles**:
   - Operators can park vehicles based on type (Bike, Car, Truck).
   - The system dynamically assigns the nearest available spot.
2. **Payment Processing**:
   - Payments are calculated based on the duration of parking (hourly rate).
   - Operators can process payments directly from the dashboard.
3. **Vehicle Exit**:
   - Vehicles cannot exit without completing payment.
   - Exiting updates the spot's availability in real-time.

---

### 📊 Real-Time Tracking

1. **Availability Tracking**:
   - Users can check floor-wise availability for specific vehicle types in any lot.
2. **Vehicle Lookup**:
   - Search for a vehicle by registration number to find its current location (lot name, floor, spot).

---

### 🕒 Parking History

Admins can view a detailed history of all parked vehicles, including:

- Entry/exit times
- Payment records
- Vehicle registration details

---

## 💻 Tech Stack

- **Backend**: FastAPI, Python 3.x
- **Frontend**: HTML, JavaScript, CSS
- **Concurrency Management**: AsyncIO with locks
- **State Management**: In-memory data structures

---

## 📋 Installation Instructions

### Prerequisites

- Python 3.x installed on your system
- A virtual environment setup

### Steps to Run Locally

1. Clone the repository:

   ```
   git clone [repository-url]
   cd [repository-folder]
   ```

2. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Navigate to the `src` folder:

   ```
   cd src/
   ```

4. Run the application:

   ```
   uvicorn api:app --reload
   ```

5. Open your browser at [http://127.0.0.1:8000](http://127.0.0.1:8000) to access the dashboard.

---

## 🛠️ Functionalities

### Admin Features

1. Create new parking lots with name, floors, and spots per floor.
2. Manage vehicle operations (park, process payment, exit).
3. Check real-time availability for any lot and vehicle type.
4. View detailed parking history for each lot.

### Operator Features

1. Park vehicles dynamically based on type (Bike/Car/Truck).
2. Process payments based on duration of parking.
3. Exit vehicles after successful payment.

### User Features

1. Check availability of spots in any lot by vehicle type.
2. Lookup vehicle location by registration number.

---

## 🖼️ Screenshots

### Dashboard (Admin View)

![Admin Dashboard](https://pplx-res.cloudinary.com/image/upload/v1740139851/user_uploads/JNSrUtBItbDPAYE/image.jpg)

---

## 📈 API Endpoints

### Admin Endpoints

- `POST /admin/create-lot`: Create a new parking lot with specified floors and spots per floor.
- `GET /history/{lot_name}`: Retrieve the complete parking history of a specific lot.

### Operator Endpoints

- `POST /operator/park`: Park a vehicle in an available spot based on its type.
- `POST /operator/payment`: Process payment for parked vehicles based on duration.
- `POST /operator/exit`: Exit a vehicle after payment is completed.

### User Endpoints

- `GET /availability/{lot_name}/{vehicle_type}`: Check floor-wise availability for a specific vehicle type in a lot.
- `GET /vehicle-lookup/{reg_num}`: Find the location of a vehicle by its registration number.

---

## 🔮 Future Enhancements

1. Integrate with a database for persistent storage of lots and vehicles.
2. Add user authentication with JWT tokens to secure endpoints further.
3. Implement advanced analytics dashboards for admins (e.g., revenue reports).
4. Support reservations for specific spots or durations via an integrated booking system.
5. Add mobile app support with push notifications for operators/admins.

---

## 👥 Contributors

- [Your Name] (Lead Developer)
- [Team Member Names]

---

## 🌟 Highlights from Project 1 to Project 2

| Feature                | Project 1                | Project 2                      |
| ---------------------- | ------------------------ | ------------------------------ |
| Parking Lot Creation   | Basic CLI-based creation | Dynamic UI-based creation      |
| Role-Based Access      | None                     | Admin, Operator, User          |
| Vehicle Operations     | Limited                  | Full lifecycle (park/pay/exit) |
| Availability Tracking  | None                     | Real-time updates              |
| Vehicle Lookup         | None                     | Registration-based search      |
| Concurrency Management | Basic                    | AsyncIO with locks             |

i have now set up and gathered a strong foundation for future iterations like Project 3.

---
