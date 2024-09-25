import WorldWind from 'worldwindjs';


// Convert degrees to radians
// This function converts an angle from degrees to radians, which is necessary for certain trigonometric calculations (like those in the Haversine formula).
const toRadians = (degrees) => degrees * (Math.PI / 180);

// Haversine formula to calculate distance between two points (in kilometers)
// The haversineDistance function calculates the distance between two geographic coordinates (latitude and longitude).
// It uses the Haversine formula, which accounts for the curvature of the Earth.
const haversineDistance = (coord1, coord2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const lat1 = toRadians(coord1.latitude);  // Convert latitude of point 1 to radians
    const lon1 = toRadians(coord1.longitude); // Convert longitude of point 1 to radians
    const lat2 = toRadians(coord2.latitude);  // Convert latitude of point 2 to radians
    const lon2 = toRadians(coord2.longitude); // Convert longitude of point 2 to radians

    // Differences in latitudes and longitudes
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    // Haversine formula to calculate the distance between two points on the surface of a sphere
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1) * Math.cos(lat2) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Final distance in kilometers
};

// Function to move a vehicle towards its assigned waypoint at a given speed (in km/h)
// This function moves a vehicle towards a waypoint incrementally based on its speed and the time interval.
// It returns true when the vehicle reaches the waypoint, otherwise false (vehicle still moving).
const moveVehicleTowardsWaypoint = (vehicle, waypoint, speedKmh, intervalDurationSeconds) => {
    const distance = haversineDistance(vehicle.position, waypoint.position); // Calculate distance to waypoint
    const speedKms = speedKmh / 3600; // Convert speed from km/h to km/s
    const distancePerInterval = speedKms * intervalDurationSeconds; // Calculate how far the vehicle moves in each time interval

    if (distance < distancePerInterval) {
        // If the vehicle can reach the waypoint in the current interval, snap it to the waypoint position
        vehicle.position.latitude = waypoint.position.latitude;
        vehicle.position.longitude = waypoint.position.longitude;
        return true; // Waypoint reached
    } else {
        // Otherwise, move the vehicle closer to the waypoint by a proportional amount
        const ratio = distancePerInterval / distance;
        vehicle.position.latitude += (waypoint.position.latitude - vehicle.position.latitude) * ratio;
        vehicle.position.longitude += (waypoint.position.longitude - vehicle.position.longitude) * ratio;
        return false; // Still moving towards waypoint
    }
};
const drawVehiclePath = (vehicleId, passedPositions, wwd, pathLayer) => {
    if (!passedPositions || passedPositions.length < 2) return; // Need at least two positions to draw a path

    // Create a new path with passed positions
    const vehiclePath = new WorldWind.Path(passedPositions, null);
    vehiclePath.altitudeMode = WorldWind.CLAMP_TO_GROUND;
    vehiclePath.followTerrain = true;
    vehiclePath.extrude = true;
    vehiclePath.useSurfaceShapeFor2D = true;

    // Configure path attributes (line color, transparency, etc.)
    const pathAttributes = new WorldWind.ShapeAttributes(null);
    pathAttributes.outlineColor = WorldWind.Color.RED; // Path outline color (red)
    pathAttributes.interiorColor = new WorldWind.Color(1, 0, 0, 0.5); // Fill color with transparency
    pathAttributes.drawVerticals = vehiclePath.extrude; // Draw vertical lines if the path is extruded
    vehiclePath.attributes = pathAttributes;

    // Clear the old path from the path layer and add the updated path
    pathLayer.removeAllRenderables();
    pathLayer.addRenderable(vehiclePath);

    // Redraw the WorldWind window to reflect the changes
    wwd.redraw();
};

// Function to update the path of a vehicle
// This function updates the visual path that shows the vehicle's route to its waypoints.
// It creates a new WorldWind Path object with updated positions and visual attributes.
const updateVehiclePath = (vehicleId, currentWaypointIndex, assignedWaypoints, paths, setPaths, wwd) => {
    setPaths(prevPaths => {
        const updatedPaths = prevPaths.map(path => {
            // Find the path associated with the current vehicle by matching its ID
            if (path.id === `${vehicleId}_path`) {
                // Update the path's positions based on the current and future waypoints
                const newPositions = [
                    assignedWaypoints[currentWaypointIndex].position,
                    ...assignedWaypoints.slice(currentWaypointIndex + 1).map(w => w.position)
                ];

                // Create a new WorldWind Path object with the updated positions
                const updatedPath = new WorldWind.Path(newPositions, null);
                updatedPath.altitudeMode = WorldWind.CLAMP_TO_GROUND;
                updatedPath.followTerrain = true;
                updatedPath.extrude = true;
                updatedPath.useSurfaceShapeFor2D = true;

                // Configure path visual attributes (like color and extrusion)
                const pathAttributes = new WorldWind.ShapeAttributes(null);
                pathAttributes.outlineColor = WorldWind.Color.BLUE; // Outline color
                pathAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.5); // Fill color with some transparency
                pathAttributes.drawVerticals = updatedPath.extrude; // Draw vertical lines from the path to the ground
                updatedPath.attributes = pathAttributes;

                // Remove the old path and add the updated path to the layer
                path.layer.removeAllRenderables();
                path.layer.addRenderable(updatedPath);

                return { ...path, positions: newPositions }; // Return the updated path object
            }
            return path;
        });

        return updatedPaths; // Return the new set of paths
    });

    wwd.redraw(); // Redraw the WorldWindow to reflect changes
};

const addStartPointLabel = (vehicle, wwd) => {
    const startPoint = new WorldWind.Position(vehicle.position.latitude, vehicle.position.longitude, vehicle.position.altitude);
    const startLabel = new WorldWind.GeographicText(startPoint, `${vehicle.id}`);
    
    const labelAttributes = new WorldWind.TextAttributes(null);
    labelAttributes.color = WorldWind.Color.YELLOW;
    labelAttributes.font = new WorldWind.Font(14);
    labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0,
        WorldWind.OFFSET_FRACTION, 0
    );
    startLabel.attributes = labelAttributes;
    startLabel.alwaysOnTop = true;

    // Create a new layer for the start label
    const labelLayer = new WorldWind.RenderableLayer(`Start Label ${vehicle.id}`);
    labelLayer.addRenderable(startLabel);
    wwd.addLayer(labelLayer);

    return labelLayer;
};

// Modified startVehicleWaypointAnimation function
const startVehicleWaypointAnimation = (
    vehicles, waypoints, placemarks, wwd, paths, setPaths, setPlacemarks, setAnimationInterval
) => {
    const vehicleWaypointIndex = {};  // Store the current waypoint index for each vehicle
    const passedPositionsMap = {};    // Store passed positions for each vehicle

    // Create a separate layer for all start labels, if not already created
    let allStartLabelsLayer = wwd.layers.find(layer => layer.displayName === "All Start Labels");
    if (!allStartLabelsLayer) {
        allStartLabelsLayer = new WorldWind.RenderableLayer("All Start Labels");
        wwd.addLayer(allStartLabelsLayer);
    }

    vehicles.forEach(vehicle => {
        vehicleWaypointIndex[vehicle.id] = 0; // Initialize index if it doesn't exist
        passedPositionsMap[vehicle.id] = [new WorldWind.Position(vehicle.position.latitude, vehicle.position.longitude)]; // Initialize passed positions

        // Add start point label for each vehicle only if it hasn't been added yet
        if (!vehicle.hasStartLabel) {
            const startLabelLayer = addStartPointLabel(vehicle, wwd);
            allStartLabelsLayer.addRenderable(startLabelLayer.renderables[0]);
            vehicle.hasStartLabel = true; // Mark that this vehicle now has a start label
        }
    });

    const intervalDuration = 0.1;
    const speedKmh = 200;

    // Path layers for vehicles
    const pathLayers = {};

    vehicles.forEach(vehicle => {
        // Create a layer to render the path for each vehicle
        const pathLayer = new WorldWind.RenderableLayer(`Path Layer ${vehicle.id}`);
        wwd.addLayer(pathLayer);
        pathLayers[vehicle.id] = pathLayer; // Store path layer for the vehicle
    });

    const interval = setInterval(() => {
        vehicles.forEach(vehicle => {
            const assignedWaypoints = waypoints.filter(w => w.vehicleId === vehicle.id);
            let currentIndex = vehicleWaypointIndex[vehicle.id];

            // Skip waypoints that are already passed
            while (currentIndex < assignedWaypoints.length && assignedWaypoints[currentIndex].isPassed) {
                currentIndex++;
            }

            // Update vehicleWaypointIndex with the new index of the unvisited waypoint
            vehicleWaypointIndex[vehicle.id] = currentIndex;

            if (currentIndex < assignedWaypoints.length) {
                const waypoint = assignedWaypoints[currentIndex];

                // Move the vehicle towards the next unvisited waypoint
                const reached = moveVehicleTowardsWaypoint(vehicle, waypoint, speedKmh, intervalDuration);

                if (reached) {
                    // Mark the waypoint as passed
                    waypoint.isPassed = true;

                    // Update the path to the next waypoint
                    updateVehiclePath(vehicle.id, currentIndex, assignedWaypoints, paths, setPaths, wwd);

                    // Add the passed waypoint position to the passedPositionsMap
                    passedPositionsMap[vehicle.id].push(new WorldWind.Position(waypoint.position.latitude, waypoint.position.longitude));

                    // Draw the updated path with passed positions
                    drawVehiclePath(vehicle.id, passedPositionsMap[vehicle.id], wwd, pathLayers[vehicle.id]);

                    // Move to the next waypoint
                    vehicleWaypointIndex[vehicle.id] += 1;
                } else {
                    // If not reached, update the path with the current position
                    passedPositionsMap[vehicle.id].push(new WorldWind.Position(vehicle.position.latitude, vehicle.position.longitude));
                    drawVehiclePath(vehicle.id, passedPositionsMap[vehicle.id], wwd, pathLayers[vehicle.id]);
                }
            }
        });

        setPlacemarks([...placemarks]); // Update placemarks
        wwd.redraw(); // Redraw the WorldWind window
    }, intervalDuration * 1000);

    setAnimationInterval(interval);
};



// Stop the vehicle waypoint animation
// This function stops the animation by clearing the interval created in `startVehicleWaypointAnimation`.
const stopVehicleWaypointAnimation = (animationInterval, setAnimationInterval) => {
    if (animationInterval) {
        clearInterval(animationInterval); // Clear the animation interval to stop updates
        setAnimationInterval(null); // Reset the animation interval state
    }
};

// Export all functions for use in other parts of the application
export {
    haversineDistance,
    moveVehicleTowardsWaypoint,
    updateVehiclePath,
    startVehicleWaypointAnimation,
    stopVehicleWaypointAnimation
};