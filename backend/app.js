/**
 * Adilabad Intercity Bus Information Service - Backend API
 * Developer: Darla Sai Charan
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable Cross-Origin Resource Sharing (CORS) for Angular frontend
app.use(cors());

// Parse incoming JSON payloads
app.use(express.json());

// Request logger for demonstration and debugging in terminal
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// In-memory cache for ultra-fast responses
let cachedBuses = null;

function getBusesData() {
  if (cachedBuses && cachedBuses.length > 0) {
    return cachedBuses;
  }
  const filePath = path.join(__dirname, 'buses.json');
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    cachedBuses = JSON.parse(rawData);
    return cachedBuses;
  } catch (error) {
    console.error('Error reading buses.json:', error.message);
    return [];
  }
}

// ------------------- API ENDPOINTS ------------------- //

/**
 * Health check & project metadata
 * GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    project: 'Adilabad Intercity Bus Information Service',
    developer: 'Darla Sai Charan',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Get all unique cities for search dropdowns
 * GET /api/cities
 */
app.get('/api/cities', (req, res) => {
  try {
    const buses = getBusesData();
    const citySet = new Set();
    buses.forEach(b => {
      if (b.startingCity) citySet.add(b.startingCity.trim());
      if (b.destinationCity) citySet.add(b.destinationCity.trim());
    });
    const cities = Array.from(citySet).sort();
    res.status(200).json({
      success: true,
      count: cities.length,
      cities: cities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve available cities',
      error: error.message
    });
  }
});

/**
 * Search buses by starting city and destination city
 * GET /api/buses/search?from=Adilabad&to=Hyderabad&date=YYYY-MM-DD
 * NOTE: Placed BEFORE /api/buses/:id to prevent route shadowing
 */
app.get('/api/buses/search', (req, res) => {
  try {
    let { from, to, date } = req.query;

    // Normalize if array (e.g. duplicate query params ?from=A&from=B)
    if (Array.isArray(from)) from = from[0];
    if (Array.isArray(to)) to = to[0];
    if (Array.isArray(date)) date = date[0];

    // Safely extract and trim string values
    const rawFrom = typeof from === 'string' ? from.trim() : '';
    const rawTo = typeof to === 'string' ? to.trim() : '';

    // Validation: Missing or whitespace-only parameters
    if (!rawFrom || !rawTo) {
      return res.status(400).json({
        success: false,
        message: 'Both starting city (from) and destination city (to) are required parameters.'
      });
    }

    const cleanFrom = rawFrom.toLowerCase();
    const cleanTo = rawTo.toLowerCase();

    // Validation: Same starting and destination city
    if (cleanFrom === cleanTo) {
      return res.status(400).json({
        success: false,
        message: 'Starting city and destination city cannot be the same.'
      });
    }

    const allBuses = getBusesData();
    const matchingBuses = allBuses.filter(bus => 
      bus.startingCity &&
      bus.destinationCity &&
      bus.startingCity.trim().toLowerCase() === cleanFrom &&
      bus.destinationCity.trim().toLowerCase() === cleanTo
    );

    res.status(200).json({
      success: true,
      from: rawFrom,
      to: rawTo,
      date: (typeof date === 'string' && date.trim()) ? date.trim() : null,
      totalResults: matchingBuses.length,
      buses: matchingBuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'An internal error occurred while searching for buses.',
      error: error.message
    });
  }
});

/**
 * Get all available bus records
 * GET /api/buses
 */
app.get('/api/buses', (req, res) => {
  try {
    const buses = getBusesData();
    res.status(200).json({
      success: true,
      totalCount: buses.length,
      buses: buses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bus records.',
      error: error.message
    });
  }
});

/**
 * Get details of a single bus by ID
 * GET /api/buses/:id
 */
app.get('/api/buses/:id', (req, res) => {
  try {
    let { id } = req.params;
    if (Array.isArray(id)) id = id[0];
    const rawId = typeof id === 'string' ? id.trim() : '';

    if (!rawId) {
      return res.status(400).json({
        success: false,
        message: 'A valid bus ID parameter is required.'
      });
    }

    const buses = getBusesData();
    const cleanId = rawId.toLowerCase();
    const bus = buses.find(b => b.id && b.id.trim().toLowerCase() === cleanId);

    if (!bus) {
      return res.status(404).json({
        success: false,
        message: `Bus with ID '${rawId}' was not found in our database.`
      });
    }

    res.status(200).json({
      success: true,
      bus: bus
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bus details.',
      error: error.message
    });
  }
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route '${req.originalUrl}' not found on this server.`
  });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: err.message
  });
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚌 Adilabad Intercity Bus Information Service API`);
  console.log(`📡 Server running on: http://localhost:${PORT}`);
  console.log(`🔍 Try searching: http://localhost:${PORT}/api/buses/search?from=Adilabad&to=Hyderabad`);
  console.log(`====================================================`);
});
