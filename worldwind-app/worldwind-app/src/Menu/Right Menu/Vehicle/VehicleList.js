// VehicleList.js
import React from 'react';
import VehicleItem from './VehicleItem';
import '../../../styles.css';

const VehicleList = ({
  vehicles,
  visiblePopupId,
  assignedVisiblePopupId,
  selectedVehicleId,
  selectedPlacemarks,
  isMovementModeActive,
  toggleWaypointPopup,
  setSelectedVehicleId,
  toggleAssignedWaypointPopup,
  handleMovementModeClick,
  handleAssignedClick,
  handleVehicleClick,
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
  setSelectedPlacemarks,
  unassignWaypoint,
}) => {
  return (
    <ul>
      {vehicles.map(vehicle => (
        <VehicleItem
          key={vehicle.id}
          unassignWaypoint={unassignWaypoint}
          vehicle={vehicle}
          visiblePopupId={visiblePopupId}
          assignedVisiblePopupId={assignedVisiblePopupId}
          selectedVehicleId={selectedVehicleId}
          selectedPlacemarks={selectedPlacemarks}
          isMovementModeActive={isMovementModeActive}
          toggleWaypointPopup={toggleWaypointPopup}
          setSelectedVehicleId={setSelectedVehicleId}
          toggleAssignedWaypointPopup={toggleAssignedWaypointPopup}
          handleMovementModeClick={handleMovementModeClick}
          handleDeletePlacemark={handleDeletePlacemark}
          waypoints={waypoints}
          handleSelectPlacemark={handleSelectPlacemark}
          handleAssignWaypoints={handleAssignWaypoints}
          hasSelectedWaypoints={hasSelectedWaypoints}
          handleTogglePlacemarkSelection={handleTogglePlacemarkSelection}
          selectionMode={selectionMode}
          handleSelectionModeClick={handleSelectionModeClick}
          setPlacemarks={setPlacemarks}
          wwd={wwd}
          buttonClicked={buttonClicked}
          updateVehiclePosition={updateVehiclePosition}
          setSelectedPlacemarks={setSelectedPlacemarks}
        />
        
      ))}
    </ul>
  );
};

export default VehicleList;