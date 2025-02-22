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

- **Database Integration**: Move from in-memory data to PostgreSQL/Firebase.
- **User Authentication**: Implement JWT-based authentication.
- **Mobile App**: Build a React Native app for operators and admins.
- **Advanced Analytics**: Create dashboards for revenue and usage insights.
- **Booking System**: Implement spot reservations in advance.

---

## 👥 Contributors

- **Saransh** (Sole Developer)

---

## 🌟 Highlights from Project 1 to Project 2 to 3

| Feature                    | First Iteration (CLI) | Second Iteration (FastAPI) | Final Iteration (Next.js)       |
| -------------------------- | --------------------- | -------------------------- | ------------------------------- |
| **Parking Lot Creation**   | CLI-based             | API-based                  | Dynamic UI                      |
| **Role-Based Access**      | None                  | Admin & Operator           | Admin, Operator, User           |
| **Vehicle Operations**     | Basic                 | Payment + Exit             | Full lifecycle + History        |
| **Availability Tracking**  | None                  | API Queries                | Real-time UI updates            |
| **Vehicle Lookup**         | None                  | API-based                  | Registration-based search       |
| **Concurrency Management** | Basic                 | AsyncIO                    | Optimized with state management |

---
