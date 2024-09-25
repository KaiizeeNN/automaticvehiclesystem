import React, { useState, useCallback, useMemo } from 'react';
import TabNavigation from './TabNavigation';
import VehiclesTab from './Vehicle/VehiclesTab';
import ObstaclesTab from './ObstaclesTab';
import WaypointsTab from './WaypointsTab';
import '../../styles.css';

// RightMenu component manages different tabs in the right menu and their content.
const RightMenu = ({
  activeRightTab, // Currently active tab in the right menu
  setActiveRightTab, // Function to set the active tab
  placemarks, // List of all placemarks
  selectedPlacemarks, // List of selected placemarks
  handleSelectPlacemark, // Function to handle selection or deselection of placemarks
  handleDeletePlacemark, // Function to delete a placemark
  drawPath, // Function to draw a path
  handleDeletePath, // Function to delete a path
  setPlacemarks, // Function to update the list of placemarks
  selectionMode, // Current selection mode
  handleSelectionModeClick, // Function to handle clicks in selection mode
  setSelectedPlacemarks, // Function to set the selected placemarks
  wwd, // Web World Wind instance or similar
  buttonClicked, // Whether a button was clicked
  unassignWaypoint,

}) => {
  // Local state to manage visibility of the waypoint popup
  const [visiblePopupId, setVisiblePopupId] = useState(null);
  const [assignedVisiblePopupId , setAssignedVisiblePopupId] = useState(null);

  // Local state to manage the currently selected vehicle ID
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);

  // Derive vehicles from placemarks by filtering out those with the name 'Waypoint'
  const vehicles = placemarks.filter(placemark => placemark.id.startsWith('V'));

  // Derive waypoints from placemarks by filtering those with the name 'Waypoint'
  const waypoints = placemarks.filter(placemark => placemark.name === 'Waypoint');
  const obstacles = placemarks.filter(placemark => placemark.name === 'Obstacle');

  // Check if any selected placemarks are waypoints
  const hasSelectedWaypoints = selectedPlacemarks.some(id => waypoints.some(waypoint => waypoint.id === id));

  // Assign waypoints to a vehicle
  const assignedWaypoints = useMemo(() => {
    const waypointsByVehicle = {};
    waypoints.forEach(waypoint => {
      if (waypoint.vehicleId) {
        if (!waypointsByVehicle[waypoint.vehicleId]) {
          waypointsByVehicle[waypoint.vehicleId] = [];
        }
        waypointsByVehicle[waypoint.vehicleId].push(waypoint);
      }
    });
    return waypointsByVehicle;
  }, [waypoints]);

  // Function to toggle the visibility of the available waypoint popup for a given vehicle
  const toggleWaypointPopup = (placemarkId) => {
    setVisiblePopupId(visiblePopupId === placemarkId ? null : placemarkId);
    
  };

  // Function to toggle the visibility of the assigned waypoint popup
  const toggleAssignedWaypointPopup = (placemarkId) => {
    setAssignedVisiblePopupId(assignedVisiblePopupId === placemarkId ? null : placemarkId);
  };

  // Handle the toggling of placemark selection
  const handleTogglePlacemarkSelection = (id) => {
    if (selectedPlacemarks.includes(id)) {
      handleSelectPlacemark(id, false); // Deselect
    } else {
      handleSelectPlacemark(id, true); // Select
    }
  };

  // Assign selected waypoints to the currently selected vehicle
  const handleAssignWaypoints = useCallback(() => {
    if (!selectedVehicleId) return;
  
    setPlacemarks(prevPlacemarks => {
      const updatedPlacemarks = prevPlacemarks.map(placemark => {
        if (placemark.name === 'Waypoint' && selectedPlacemarks.includes(placemark.id)) {
          return { ...placemark, vehicleId: selectedVehicleId }; // Assign to the vehicle
        }
        return placemark;
      });
  
      // Clear the selection after assignment
      setSelectedPlacemarks([]); // Clear selected waypoints
      handleSelectionModeClick();
      return updatedPlacemarks;
    });
  }, [selectedVehicleId, selectedPlacemarks, setPlacemarks, setSelectedPlacemarks, handleSelectionModeClick]);

  return (
    <div className="right-menu-content">
      {/* Tab Navigation */}
      <TabNavigation activeRightTab={activeRightTab} setActiveRightTab={setActiveRightTab} />

      {/* Tab Content */}
      {activeRightTab === 'placemarks' && (
        <VehiclesTab
          vehicles={vehicles}
          waypoints={waypoints}
          visiblePopupId={visiblePopupId}
          selectedVehicleId={selectedVehicleId}
          toggleWaypointPopup={toggleWaypointPopup}
          toggleAssignedWaypointPopup={toggleAssignedWaypointPopup}
          setSelectedVehicleId={setSelectedVehicleId}
          handleAssignWaypoints={handleAssignWaypoints}
          hasSelectedWaypoints={hasSelectedWaypoints}
          selectedPlacemarks={selectedPlacemarks}
          handleSelectPlacemark={handleSelectPlacemark}
          handleDeletePlacemark={handleDeletePlacemark}
          unassignWaypoint={unassignWaypoint}
          drawPath={drawPath}
          handleTogglePlacemarkSelection={handleTogglePlacemarkSelection}
          assignedWaypoints={assignedWaypoints} // New prop passed to VehiclesTab
          assignedVisiblePopupId={assignedVisiblePopupId}
          selectionMode={selectionMode}
          handleSelectionModeClick={handleSelectionModeClick}
          setSelectedPlacemarks={setSelectedPlacemarks}
          wwd={wwd}
          buttonClicked={buttonClicked}
          setPlacemarks={setPlacemarks}
        />
      )}

      {activeRightTab === 'obstacles' && (
        <ObstaclesTab
        obstacles = {obstacles}
        handleDeletePlacemark = {handleDeletePlacemark}
        selectedPlacemarks = {selectedPlacemarks}
        handleTogglePlacemarkSelection/>
      )}

      {activeRightTab === 'waypoints' && (
        <WaypointsTab
          waypoints={waypoints}
          vehicles={vehicles}
          handleDeletePlacemark={handleDeletePlacemark}
          handleTogglePlacemarkSelection={handleTogglePlacemarkSelection}
        />
      )}
    </div>
  );
};


export default RightMenu;
