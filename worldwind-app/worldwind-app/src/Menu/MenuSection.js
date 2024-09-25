import React from 'react';

const MenuSection = ({
  sectionType,
  activeMenu,
  handleMenuToggle,
  handleSelectionModeClick,
  selectionMode,
  handleStartStop
}) => {
  const isActive = activeMenu === sectionType;

  const renderButtons = (buttons) => (
    buttons.map((name) => (
      <button
        key={name}
        className={`menu-button ${selectionMode.activeName === name ? (name.startsWith('Enemy') ? 'enemy-active' : 'active') : 'inactive'} ${selectionMode.activeName === name ? (name.startsWith('Alliance') ? 'alliance-active' : 'active') : 'inactive'}`}
        onClick={() => handleSelectionModeClick(name)}
      >
        {name}
      </button>
    ))
  );

  const renderSectionContent = () => {
    if (sectionType === 'Add Vehicle') {
      return renderButtons(['Alliance Ground', 'Enemy Ground', 'Alliance Air', 'Enemy Air']);
    }

    if (sectionType === 'Obstacle') {
      return (
        <button
          className={`menu-button waypoint-startbutton ${selectionMode.activeName === 'Obstacle' ? 'active' : 'inactive'}`}
          onClick={() => handleSelectionModeClick('Obstacle')}
        >
          {selectionMode.activeName === 'Obstacle' ? 'Active' : 'Deactive'}
        </button>
      );
    }

    if (sectionType === 'Waypoint') {
      return (
        <button
          className={`menu-button waypoint-startbutton ${selectionMode.activeName === 'Waypoint' ? 'active' : 'inactive'}`}
          onClick={() => handleSelectionModeClick('Waypoint')}
        >
          {selectionMode.activeName === 'Waypoint' ? 'Active' : 'Deactive'}
        </button>
      );
    }

    if (sectionType === 'Start/Stop') {
      return (
        <button
          className={`menu-button waypoint-startbutton ${selectionMode.activeName === 'Start/Stop' ? 'active' : 'inactive'}`}
          onClick={() => {
            handleSelectionModeClick('Start/Stop');
            handleStartStop();
          }}
        >
          {selectionMode.activeName === 'Start/Stop' ? 'Stop' : 'Start'}
        </button>
      );
    }

    return null;
  };

  return (
    <div className="menu-toggle">
      <button
        className="menu-button menu-button-toggle"
        onClick={() => handleMenuToggle(sectionType)}
      >
        {sectionType}
      </button>
      {isActive && (
        <div className="menu-content">
          {renderSectionContent()}
        </div>
      )}
    </div>
  );
};

export default MenuSection;
