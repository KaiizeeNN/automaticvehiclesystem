import React from 'react';
import '../../styles.css';

const TabNavigation = ({ activeRightTab, setActiveRightTab }) => {
  return (
    <div className="tab-container">
      <button
        className={`tab-button tabButtonPlacemarks ${activeRightTab === 'placemarks' ? 'active' : ''}`}
        onClick={() => setActiveRightTab('placemarks')}
      >
        Vehicles
      </button>
      <button
        className={`tab-button tabButtonPaths ${activeRightTab === 'obstacles' ? 'active' : ''}`}
        onClick={() => setActiveRightTab('obstacles')}
      >
        Obstacles
      </button>
      <button
        className={`tab-button tabButtonPlacemarks ${activeRightTab === 'waypoints' ? 'active' : ''}`}
        onClick={() => setActiveRightTab('waypoints')}
      >
        Waypoints
      </button>
    </div>
  );
};

export default TabNavigation;
