// VehicleItem.js
import React from 'react';
import AssignedWaypoints from '../WaypointPopups/AssignedWaypoints';
import WaypointPopup from '../WaypointPopups/WaypointPopup';
import '../../../styles.css';

const VehicleItem = ({
  vehicle,
  visiblePopupId,
  assignedVisiblePopupId,
  selectedVehicleId,
  selectedPlacemarks,
  isMovementModeActive,
  unassignWaypoint,
  toggleWaypointPopup,
  setSelectedVehicleId,
  toggleAssignedWaypointPopup,
  handleMovementModeClick,
  handleDeletePlacemark,
  waypoints,
  handleSelectPlacemark,
  handleAssignWaypoints,
  hasSelectedWaypoints,
  handleTogglePlacemarkSelection,
  selectionMode,
  handleSelectionModeClick,
  setPlacemarks,
  wwd,
  buttonClicked,
  updateVehiclePosition,
  
}) => {
  //Handling selection for WASD mode (Only 1 vehicle can be selected)
  const selectionOnWASDMode = (id) => {

    //Close popups if they're open.
    toggleWaypointPopup();
    toggleAssignedWaypointPopup();
    
    // Deselect all other vehicles before selecting the new one
    selectedPlacemarks.forEach((selectedId) => {
      if (selectedId !== id) {
        handleSelectPlacemark(selectedId, false); // Deselect previous
      }
    });
  
    // Select or deselect the current vehicle
    if (selectedPlacemarks.includes(id)) {
      handleSelectPlacemark(id, false); // Deselect
    } else {
      handleSelectPlacemark(id, true); // Select
    }
  };
  
  //Deselect previous ones, select the selected vehicle
  //Activate the WASD Movement Mode
    const handleSelectVehicleWASDMode = (id) => {
        selectionOnWASDMode(id);
        handleMovementModeClick(id);
      };
  //Handling assigned waypoints popup. Toggle Available Waypoins Popup (if its open, close it). 
  //Deselect previously selected placemarks/buttons. Select the current vehicle.
      const handleAssignedWaypointsPopup = (vehicleId) => {
        handleSelectionModeClick();
        toggleWaypointPopup();
        setSelectedVehicleId(null);
        setSelectedVehicleId(vehicleId);
        toggleAssignedWaypointPopup(vehicleId)
        
        
        
      };
    //Handling Available Waypoints Popup. Toggle Assigned Waypoints Popup (if its open, close it). 
    //Deselect previously selected placemarks/buttons. Select the current vehicle.
      const handleAvailableWaypointsPopup = (vehicleId) => {
        console.log(selectedVehicleId);
        handleSelectionModeClick();
        toggleAssignedWaypointPopup()
        setSelectedVehicleId(null);
        setSelectedVehicleId(vehicleId);
        toggleWaypointPopup(vehicleId);
        

    };
  return (
    <li className="placemark-item">
      <div className="placemark-details">
        <span>Type: {vehicle.name}</span>
        <div>Id: {vehicle.id}</div>
        <div>Lat: {vehicle.position.latitude.toFixed(4)}</div>
        <div>Lon: {vehicle.position.longitude.toFixed(4)}</div>
      </div>
      <button
        className={`placemarkSelectButton movementModeSelectVehicle ${
          selectedPlacemarks.includes(vehicle.id) ? 'selected' : 'deselected'
        }`}
        onClick={() => handleSelectVehicleWASDMode(vehicle.id)}
      >
        {selectedPlacemarks.includes(vehicle.id) ? 'Deactivate Manuel Movement' : 'Activate Manuel Movement'}
      </button>
      <button
        className="placemarkSelectButton popupButton"
        onClick={() => handleAssignedWaypointsPopup(vehicle.id)}
      >
        {assignedVisiblePopupId === vehicle.id ? 'Close Waypoints' : 'Assigned Waypoints'}
      </button>
      {assignedVisiblePopupId === vehicle.id && (
        <AssignedWaypoints
          waypoints={waypoints}
          vehicles={[vehicle]}
          selectedPlacemarks={selectedPlacemarks}
          handleSelectPlacemark={handleSelectPlacemark}
          handleAssignWaypoints={handleAssignWaypoints}
          hasSelectedWaypoints={hasSelectedWaypoints}
          unassignWaypoint={unassignWaypoint}
          selectedVehicleId={vehicle.id}
          handleTogglePlacemarkSelection={handleTogglePlacemarkSelection}
          selectionMode={selectionMode}
          handleSelectionModeClick={handleSelectionModeClick}
          setPlacemarks={setPlacemarks}
          wwd={wwd}
          buttonClicked={buttonClicked}
          handleDeletePlacemark={handleDeletePlacemark}
        />
      )}
      <button
        className="placemarkSelectButton popupButton"
        onClick={() => handleAvailableWaypointsPopup(vehicle.id)}
      >
        {visiblePopupId === vehicle.id ? 'Close Waypoints' : 'Assign Available Waypoints'}
      </button>
      {visiblePopupId === vehicle.id && (
        <WaypointPopup
          waypoints={waypoints.filter(wp => !wp.vehicleId)}
          vehicles={[vehicle]}
          selectedPlacemarks={selectedPlacemarks}
          handleSelectPlacemark={handleSelectPlacemark}
          handleAssignWaypoints={handleAssignWaypoints}
          hasSelectedWaypoints={hasSelectedWaypoints}
          toggleWaypointPopup={toggleWaypointPopup}
          selectedVehicleId={selectedVehicleId}
          handleTogglePlacemarkSelection={handleTogglePlacemarkSelection}
          setPlacemarks={setPlacemarks}
        />
      )}
      <button
        className="placemarkDeleteButton"
        onClick={() => handleDeletePlacemark(vehicle.id)}
      >
        Delete
      </button>
    </li>
  );
};

export default VehicleItem;