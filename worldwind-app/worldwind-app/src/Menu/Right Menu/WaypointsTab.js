import React from 'react';
import '../../styles.css';

const WaypointsTab = ({ 
  waypoints, 
  vehicles, 
  handleDeletePlacemark,
  selectedPlacemarks,
  handleTogglePlacemarkSelection
}) => {
  return (
    <div className="tab-content">
    <h3>Waypoints</h3>
    <ul>
      {waypoints.map(waypoint => (
        <li key={waypoint.id} className="placemark-item">
          <div className="placemark-details">
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
            <div>Lat: {waypoint.position.latitude.toFixed(4)}</div>
            <div>Lon: {waypoint.position.longitude.toFixed(4)}</div>
          </div>
          <button className="placemarkDeleteButton" onClick={() => handleDeletePlacemark(waypoint.id)}>Delete</button>
        </li>
      ))}
    </ul>
  </div>
  );
};


export default WaypointsTab;
