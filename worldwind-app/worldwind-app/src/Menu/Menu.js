import React from 'react';
import MenuSection from './MenuSection';
import RightMenu from './Right Menu/RightMenu';
import '../styles.css';

const Menu = ({
  handleMenuToggle,
  activeMenu,
  selectionMode,
  handleSelectionModeClick,
  handleRightMenuToggle,
  buttonClicked,
  rightMenuOpen,
  activeRightTab,
  setActiveRightTab,
  placemarks,
  handleSelectPlacemark,
  handleDeletePlacemark,
  selectedPlacemarks,
  drawPath,
  paths,
  setPlacemarks,
  handleDeletePath,
  setSelectedPlacemarks,
  wwd,
  handleStartStop,
  unassignWaypoint,
  obstacles
}) => {

  const renderMenuSections = () => (
    <>
      <MenuSection
        sectionType="Add Vehicle"
        activeMenu={activeMenu}
        handleMenuToggle={handleMenuToggle}
        handleSelectionModeClick={handleSelectionModeClick}
        selectionMode={selectionMode}
      />
      <MenuSection
        sectionType="Obstacle"
        activeMenu={activeMenu}
        handleMenuToggle={handleMenuToggle}
        handleSelectionModeClick={handleSelectionModeClick}
        selectionMode={selectionMode}
      />
      <MenuSection
        sectionType="Waypoint"
        activeMenu={activeMenu}
        handleMenuToggle={handleMenuToggle}
        handleSelectionModeClick={handleSelectionModeClick}
        selectionMode={selectionMode}
      />
      <MenuSection
        sectionType="Start/Stop"
        activeMenu={activeMenu}
        handleMenuToggle={handleMenuToggle}
        handleSelectionModeClick={handleSelectionModeClick}
        selectionMode={selectionMode}
        handleStartStop={handleStartStop}
      />
    </>
  );

  return (
    <div id="canvas-container">
      <canvas id="canvasOne"></canvas>
      <div id="button-container">
        {renderMenuSections()}

        <button
          className={`menu-button right-menu-toggle ${buttonClicked ? 'clicked' : ''}`}
          onClick={handleRightMenuToggle}
        >
          List View
        </button>

        {rightMenuOpen && (
          <RightMenu
            activeRightTab={activeRightTab}
            setActiveRightTab={setActiveRightTab}
            placemarks={placemarks}
            selectedPlacemarks={selectedPlacemarks}
            handleSelectPlacemark={handleSelectPlacemark}
            handleDeletePlacemark={handleDeletePlacemark}
            drawPath={drawPath}
            handleDeletePath={handleDeletePath}
            setPlacemarks={setPlacemarks}
            selectionMode={selectionMode}
            handleSelectionModeClick={handleSelectionModeClick}
            setSelectedPlacemarks={setSelectedPlacemarks}
            wwd={wwd}
            buttonClicked={buttonClicked}
            obstacles={obstacles}
            unassignWaypoint={unassignWaypoint}
          />
        )}
      </div>
    </div>
  );
};


export default Menu;
