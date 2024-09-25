// VehiclesTab.js
import React from 'react';
import VehicleList from './VehicleList';
import useVehicleMovement from './manuelVehicleMovement';
import '../../../styles.css';

const VehiclesTab = ({
  vehicles,
  waypoints,
  visiblePopupId,
  assignedVisiblePopupId,
  selectedVehicleId,
  toggleWaypointPopup,
  setSelectedVehicleId,
  toggleAssignedWaypointPopup,
  handleAssignWaypoints,
  hasSelectedWaypoints,
  selectedPlacemarks,
  handleSelectPlacemark,
  handleDeletePlacemark,
  drawPath,
  handleTogglePlacemarkSelection,
  selectionMode,
  handleSelectionModeClick,
  setPlacemarks,
  wwd,
  buttonClicked,
  setSelectedPlacemarks,
  unassignWaypoint,
}) => {
  const {
    isMovementModeActive,
    handleMovementModeClick,
    updateVehiclePosition
  } = useVehicleMovement(vehicles, setPlacemarks, wwd);

  

  return (
    <div className="tab-content">
      <h3>Vehicles</h3>
      <VehicleList
        vehicles={vehicles}
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
        unassignWaypoint={unassignWaypoint}
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
    </div>
  );
};

export default VehiclesTab;