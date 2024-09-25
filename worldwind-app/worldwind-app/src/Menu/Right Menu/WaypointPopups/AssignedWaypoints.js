import React, { useState, useEffect } from 'react';
import '../../../styles.css';
import { useCanvasClickHandler } from '../../../CanvasClickHandler';

const AssignedWaypoints = ({
  waypoints,
  selectedPlacemarks,
  handleSelectPlacemark,
  handleAssignWaypoints,
  hasSelectedWaypoints,
  vehicles,
  handleTogglePlacemarkSelection,
  selectedVehicleId,
  selectionMode,
  handleSelectionModeClick,
  setPlacemarks,
  wwd,
  buttonClicked,
  handleDeletePlacemark,
  unassignWaypoint
}) => {
  const [localSelectedVehicleId, setLocalSelectedVehicleId] = useState(selectedVehicleId);

  useEffect(() => {
    setLocalSelectedVehicleId(selectedVehicleId);
  }, [selectedVehicleId]);


  const handleAssignNewClick = () => {
    if (localSelectedVehicleId) {
      handleSelectionModeClick('New Waypoint');
    } else {
      alert('Please select a vehicle before assigning a new waypoint.');
    }
  };

  useCanvasClickHandler(wwd, selectionMode, setPlacemarks, buttonClicked, localSelectedVehicleId)

  return (
    <div className="waypoint-popup">
      <h3>Assigned Waypoints</h3>
      <ul>
        {waypoints
          .filter(waypoint => waypoint.vehicleId === localSelectedVehicleId)
          .map(waypoint => (
            <li key={waypoint.id} className="waypoint-popup-item placemark-item">
              <div className="placemark-details waypoint-popup-details">
                <span>Type: {waypoint.name}</span>
                <div>Id: {waypoint.id}</div>
                <div>
                  Location: Lat: {waypoint.position.latitude.toFixed(4)}, Lon: {waypoint.position.longitude.toFixed(4)}
                </div>
              </div>
              <button className="assignedPlacemarkUnassignButton" onClick={() => unassignWaypoint(waypoint.id)}>Unassign</button>
              <button className="placemarkDeleteButton assignedPlacemarkDeleteButton" onClick={() => handleDeletePlacemark(waypoint.id)}>Delete</button>
            </li>
          ))}
      </ul>
      <button
        className={`menu-button assignedWaypointAssignNew ${selectionMode.activeName === 'New Waypoint' ? 'active' : 'inactive'}`}
        onClick={handleAssignNewClick}
      >
        {selectionMode.activeName === 'New Waypoint' ? 'Active' : 'Assign New'}
      </button>
    </div>
  );
};


export default AssignedWaypoints;