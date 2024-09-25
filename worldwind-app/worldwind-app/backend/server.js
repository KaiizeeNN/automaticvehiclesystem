const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

const PORT = 3000;

let vehicles = [];
let waypoints = [];
let obstacles = [];

const parseJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Respond to preflight requests
    res.writeHead(204); // No content
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  const method = req.method.toUpperCase();

  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (chunk) => {
    buffer += decoder.write(chunk);
  });

  req.on('end', () => {
    buffer += decoder.end();
    const body = parseJSON(buffer);
    
    // POST Method
    if (method === 'POST') {
      if (path === 'api/obstacles') {
        if (body && body.latitude !== undefined && body.longitude !== undefined) {
          const newObstacle = { ...body };
          obstacles.push(newObstacle);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newObstacle));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Latitude and longitude are required' }));
        }
      } else if (path === 'api/vehicles') {
        if (body && body.id && body.name && body.latitude !== undefined && body.longitude !== undefined) {
          const newVehicle = { id: body.id, name: body.name, position: { latitude: body.latitude, longitude: body.longitude } };
          vehicles.push(newVehicle);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newVehicle));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Vehicle ID, name, latitude, and longitude are required' }));
        }
      } else if (path === 'api/waypoints') {
        if (body && body.latitude !== undefined && body.longitude !== undefined) {
          const newWaypoint = { ...body };
          waypoints.push(newWaypoint);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newWaypoint));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Latitude and longitude are required' }));
        }
      }
    }

    // GET Method
    else if (method === 'GET') {
      if (path === 'api/obstacles') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(obstacles));
      } else if (path === 'api/vehicles') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(vehicles));
      } else if (path === 'api/waypoints') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(waypoints));
      } else if (path.startsWith('api/vehicles/') && path.endsWith('/waypoints')) {
        const vehicleId = path.split('/')[2];
        const assignedWaypoints = waypoints.filter(wp => wp.vehicleId === vehicleId);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(assignedWaypoints));
      }
    }

    // DELETE Method
    else if (method === 'DELETE') {
      const id = path.split('/')[2];
      if (path.startsWith('api/obstacles/')) {
        obstacles = obstacles.filter(obstacle => obstacle.id !== id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Obstacle deleted successfully' }));
      } else if (path.startsWith('api/vehicles/')) {
        vehicles = vehicles.filter(vehicle => vehicle.id !== id);
        waypoints = waypoints.map(wp => wp.vehicleId === id ? { ...wp, vehicleId: null } : wp);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Vehicle and associated waypoints unassigned successfully' }));
      } else if (path.startsWith('api/waypoints/')) {
        waypoints = waypoints.filter(wp => wp.id !== id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Waypoint deleted successfully' }));
      }
    }

    // PUT Method for updating vehicle position or unassigning waypoint
    else if (method === 'PUT') {
      if (path.startsWith('api/vehicles/')) {
        const id = path.split('/')[2];
        if (body && body.latitude !== undefined && body.longitude !== undefined) {
          const vehicle = vehicles.find(v => v.id === id);
          if (vehicle) {
            vehicle.position = { latitude: body.latitude, longitude: body.longitude };
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(vehicle));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Vehicle not found' }));
          }
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Latitude and longitude are required' }));
        }
      } else if (path.startsWith('api/waypoints/')) {
        const id = path.split('/')[2];
        const waypoint = waypoints.find(wp => wp.id === id);
      
        if (waypoint) {
          if (body && body.vehicleId === null) {
            waypoint.vehicleId = null; // Unassign the waypoint
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(waypoint));
          } else {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'vehicleId is required for unassigning' }));
          }
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Waypoint not found' }));
        }
      }
      
    }

    // Handle other cases
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });

  req.on('error', (err) => {
    console.error('Request error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
