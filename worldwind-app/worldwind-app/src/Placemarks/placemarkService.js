import WorldWind from 'worldwindjs';
import { createPlacemarkAttributes } from './PlacemarkUtils';

let vehicleCounter = 0;  // Global counter for vehicles
let waypointCounter = 0; // Global counter for waypoints
let obstacleCounter = 0; // Global counter for obstacles


/**
 * Function to add a placemark to the WorldWind viewer and store it in the backend.
 *
 * @param {object} wwd - The WorldWind viewer object.
 * @param {WorldWind.Position} position - The position where the placemark will be placed.
 * @param {function} setPlacemarks - Function to update the list of placemarks.
 * @param {string} name - The name to assign to the placemark (e.g., 'Waypoint' or 'Vehicle').
 * @param {string} imageSource - The source path for the placemark icon.
 * @param {string} [vehicleId=null] - The ID of the vehicle to which the waypoint is assigned, if applicable.
 */
export const addPlacemark = async (wwd, position, setPlacemarks, name, imageSource, vehicleId = null) => {
  if (!wwd) return;

  // Create placemark attributes
  const placemarkAttributes = createPlacemarkAttributes(imageSource);
  const newPlacemark = new WorldWind.Placemark(position, false, placemarkAttributes);
  newPlacemark.altitudeMode = WorldWind.CLAMP_TO_GROUND;

  // Generate a new ID using global counters
  let newId;
  let apiEndpoint;

  // Ensure the name is either 'Vehicle' or 'Waypoint'
  if (name === 'Waypoint') {
    newId = `W${++waypointCounter}`;  // Increment and assign a waypoint ID
    apiEndpoint = '/api/waypoints';    // Use waypoints API endpoint
  } else if (name==='Obstacle') {

    newId = `O${++obstacleCounter}`;  // Increment and assign a waypoint ID
    apiEndpoint = '/api/obstacles';    // Use waypoints API endpoint
  }
   else { 
    newId = `V${++vehicleCounter}`;    // Increment and assign a vehicle ID
    apiEndpoint = '/api/vehicles';     // Use vehicles API endpoint
  }

  newPlacemark.label = newId;

  // Create label attributes
  const labelAttributes = new WorldWind.TextAttributes(null);
  labelAttributes.color = WorldWind.Color.WHITE;
  labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 3
  );
  newPlacemark.labelAttributes = labelAttributes;
  newPlacemark.eyeDistanceScaling = false;

  const placemarkLayer = new WorldWind.RenderableLayer("Placemark Layer");
  wwd.addLayer(placemarkLayer);
  placemarkLayer.addRenderable(newPlacemark);

  // Create the new placemark object
  const placemarkData = { id: newId, name, position, layer: placemarkLayer, vehicleId };

  try {
    // Send the new placemark data to the backend using fetch
    const response = await fetch(`http://localhost:3000${apiEndpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        latitude: position.latitude,
        longitude: position.longitude,
        name,
        imageSource,
        vehicleId,  // Add this field if it's a waypoint
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save placemark');
    }

    const savedPlacemark = await response.json();
    console.log('Placemark saved to backend:', savedPlacemark);

    // Update the placemarks state after successfully saving to backend
    setPlacemarks(prevPlacemarks => [...prevPlacemarks, placemarkData]);

  } catch (error) {
    console.error('Error saving placemark:', error);

    // Optionally, remove the placemark from the viewer if saving to backend fails
    placemarkLayer.removeAllRenderables();
    wwd.removeLayer(placemarkLayer);
    wwd.redraw();
  }

  wwd.redraw();
};

export const addAssignedWaypoint = async (wwd, position, setPlacemarks, name, imageSource, selectedVehicleId) => {
  if (!wwd || !selectedVehicleId) return;

  // Create placemark attributes
  const placemarkAttributes = createPlacemarkAttributes(imageSource);
  const newPlacemark = new WorldWind.Placemark(position, false, placemarkAttributes);
  newPlacemark.altitudeMode = WorldWind.CLAMP_TO_GROUND;

  // Generate a new ID for the waypoint
  const newId = `W${++waypointCounter}`;  // Using timestamp for unique ID
  newPlacemark.label = newId;

  // Create label attributes
  const labelAttributes = new WorldWind.TextAttributes(null);
  labelAttributes.color = WorldWind.Color.WHITE;
  labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 3
  );
  newPlacemark.labelAttributes = labelAttributes;
  newPlacemark.eyeDistanceScaling = false;

  const placemarkLayer = new WorldWind.RenderableLayer("Placemark Layer");
  wwd.addLayer(placemarkLayer);
  placemarkLayer.addRenderable(newPlacemark);

  // Create the new waypoint object
  const waypointData = { 
    id: newId, 
    name, 
    position, 
    layer: placemarkLayer, 
    vehicleId: selectedVehicleId 
  };

  try {
    // Send the new waypoint data to the backend
    const response = await fetch('http://localhost:3000/api/waypoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: newId,
        latitude: position.latitude,
        longitude: position.longitude,
        name,
        imageSource,
        vehicleId: selectedVehicleId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save waypoint');
    }

    const savedWaypoint = await response.json();
    console.log('Waypoint saved to backend:', savedWaypoint);

    // Update the placemarks state after successfully saving to backend
    setPlacemarks(prevPlacemarks => [...prevPlacemarks, waypointData]);

  } catch (error) {
    console.error('Error saving waypoint:', error);

    // Remove the waypoint from the viewer if saving to backend fails
    placemarkLayer.removeAllRenderables();
    wwd.removeLayer(placemarkLayer);
    wwd.redraw();
  }

  wwd.redraw();
};


export const unassignWaypoint = async (waypointId, setPlacemarks, wwd) => {
  if (!waypointId) return;

  try {
    // Send the PUT request to unassign the waypoint
    const response = await fetch(`http://localhost:3000/api/waypoints/${waypointId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleId: null }), // Set vehicleId to null for unassigning
    });

    if (!response.ok) {
      throw new Error('Failed to unassign waypoint');
    }

    const updatedWaypoint = await response.json();
    console.log('Waypoint unassigned:', updatedWaypoint);

    // Update the placemarks state after successfully unassigning
    setPlacemarks(prevPlacemarks =>
      prevPlacemarks.map(pm =>
        pm.id === waypointId ? { ...pm, vehicleId: null } : pm
      )
    );

    // Redraw the scene if needed
    wwd.redraw();
  } catch (error) {
    console.error('Error unassigning waypoint:', error);
  }
};


