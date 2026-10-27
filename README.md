# Adilabad Intercity Bus Information Service

Public transit schedule and route navigation portal for Adilabad District.  
**Designed & Developed by Darla Sai Charan**

---

## 🏛️ Project Overview

The **Adilabad Intercity Bus Information Service** is a full-stack transit management and schedule information platform engineered to provide reliable, real-time timetable visibility, fare computation, stop details, and route mapping for intercity passenger transit originating from or travelling to Adilabad CBS (Central Bus Station).

- **Backend**: Node.js & Express.js REST API with zero-latency JSON in-memory caching.
- **Frontend**: Angular 22 Single-Page Application (SPA) with custom glassmorphism design system.
- **Data Coverage**: Comprehensive routes connecting Adilabad to Hyderabad, Nizamabad, Nirmal, Karimnagar, Mancherial, and surrounding regional hubs.

---

## 🚀 Quick Start Guide

### 1. Start the Backend API (Terminal 1)
```bash
cd backend
npm install
node app.js
```
*API Server runs on: `http://localhost:3000`*

### 2. Start the Frontend Portal (Terminal 2)
```bash
cd frontend
npm install
npx ng serve --port 4200
```
*Web Portal runs on: `http://localhost:4200`*

### 3. Open in Browser
- **Transit Web Portal**: [http://localhost:4200](http://localhost:4200)
- **Backend API Health Check**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Bus Catalog Endpoint**: [http://localhost:3000/api/buses](http://localhost:3000/api/buses)

---

## 📡 REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Server status and service health check |
| `GET` | `/api/cities` | List of all serviced transit origin and destination cities |
| `GET` | `/api/buses` | Complete list of all active intercity bus schedules |
| `GET` | `/api/buses/search?from=:from&to=:to` | Query schedules by origin and destination city |
| `GET` | `/api/buses/:id` | Fetch full details, boarding points, and amenities by bus ID |

---

## 🧪 System Verification & Automated Testing

### Run Backend API Test Suite
```bash
cd backend
npm run test:api
```

### Run Full-Stack End-to-End System Audit
```bash
node system-check.js
```

---

## 🛡️ Key Features

- **Instant Timetable & Route Query**: Fast lookup between Adilabad and major Telangana cities.
- **Service Categories**: TSRTC Super Luxury, Rajadhani AC, Garuda Plus AC, Deluxe, and Express.
- **Official Tariff Calculations**: Direct transparent fare listings with zero convenience surcharges.
- **Real-Time Seat Availability**: Live seat counter with dynamic status indicators.
- **Boarding & Dropping Points**: Complete stop-by-stop route timelines with estimated milestones.
- **Accessibility & Responsive Design**: Optimized for smartphones, tablets, and desktop displays.
