import React from 'react';
import '../../../styles.css';

const WaypointPopup = ({
  waypoints,
  selectedPlacemarks,
  handleSelectPlacemark,
  handleAssignWaypoints,
  hasSelectedWaypoints,
  vehicles,
  handleTogglePlacemarkSelection,
  selectedVehicleId
}) => {
  return (
    <div className="waypoint-popup">
      <h3>Waypoints</h3>
      <ul>
        {waypoints.map(waypoint => (
          <li key={waypoint.id} className="waypoint-popup-item placemark-item">
            <div className="placemark-details waypoint-popup-details">
              <span>Type: {waypoint.name}</span>
              <div>Id: {waypoint.id}</div>
              {waypoint.vehicleId ? (
                <>
                  <div>Vehicle Type: {vehicles.find(v => v.id === waypoint.vehicleId)?.name || 'Unknown'}</div>
                  <div>Vehicle Id: {waypoint.vehicleId}</div>
                </>
              ) : (
                <div>Vehicle: Not Assigned</div>
              )}
              <div>Location: Lat: {waypoint.position.latitude.toFixed(4)}, Lon: {waypoint.position.longitude.toFixed(4)}</div>
            </div>
            <button
              className={`popupSelectButton placemarkSelectButton ${selectedPlacemarks.includes(waypoint.id) ? 'selected' : 'deselected'}`}
              onClick={() => handleTogglePlacemarkSelection(waypoint.id)}
            >
              {selectedPlacemarks.includes(waypoint.id) ? 'Deselect' : 'Select'}
            </button>
          </li>
        ))}
      </ul>
      <button
        className="popupAssignButton"
        onClick={handleAssignWaypoints}
        disabled={!selectedVehicleId || !hasSelectedWaypoints}
      >
        Assign
      </button>
    </div>
  );
};

export default WaypointPopup;
