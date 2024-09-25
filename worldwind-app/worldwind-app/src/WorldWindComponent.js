import React, { useEffect, useState, useCallback } from 'react';
import WorldWind from 'worldwindjs';

import './styles.css'; // Component styles
import Menu from './Menu/Menu'; // Menu component
import { useCanvasClickHandler } from './CanvasClickHandler'; // Custom hook for canvas clicks
import {
  handleSelectPlacemark,
  handleDeletePlacemark,
} from './Placemarks/PlacemarkUtils'; // Placemark utilities
import {
  startVehicleWaypointAnimation,
  stopVehicleWaypointAnimation,
} from './Paths/AutoDirectMovement'; // Animation management
import { unassignWaypoint } from './Placemarks/placemarkService';

const WorldWindComponent = () => {
  const [selectionMode, setSelectionMode] = useState({ activeName: null }); // Active selection mode
  const [wwd, setWwd] = useState(null); // WorldWind instance
  const [activeMenu, setActiveMenu] = useState(null); // Active menu state
  const [rightMenuOpen, setRightMenuOpen] = useState(false); // Right menu visibility
  const [placemarks, setPlacemarks] = useState([]); // List of placemarks
  const [selectedPlacemarks, setSelectedPlacemarks] = useState([]); // Selected placemarks
  const [paths, setPaths] = useState([]); // Paths data
  const [activeRightTab, setActiveRightTab] = useState('placemarks'); // Active tab in right menu
  const [buttonClicked, setButtonClicked] = useState(null); // Last button clicked
  const [animationInterval, setAnimationInterval] = useState(null); // Animation interval
  const [globe, setGlobe] = useState(null); // Globe state

  // Initialize WorldWind instance on mount
  useEffect(() => {
    const wwdInstance = new WorldWind.WorldWindow('canvasOne');
    const globeInstance = wwdInstance.globe;
    wwdInstance.addLayer(new WorldWind.BMNGOneImageLayer());
    wwdInstance.addLayer(new WorldWind.BMNGLayer());
    wwdInstance.addLayer(new WorldWind.BingAerialLayer());
    wwdInstance.addLayer(new WorldWind.AtmosphereLayer());
    wwdInstance.addLayer(new WorldWind.CoordinatesDisplayLayer(wwdInstance));
    wwdInstance.addLayer(new WorldWind.ViewControlsLayer(wwdInstance));
    wwdInstance.navigator.lookAtLocation.latitude = 39.2816;
    wwdInstance.navigator.lookAtLocation.longitude = 32.3015;

    wwdInstance.navigator.tilt = 59; // The tilt angle in degrees, 0 is looking straight down
    wwdInstance.navigator.range = 2100;

    //wwdInstance.navigator.range = 1000;
    setWwd(wwdInstance);
    setGlobe(globeInstance);
  }, []);

  // Toggle menu visibility
  const handleMenuToggle = useCallback(
    (menu) => {
      setActiveMenu((prev) => (prev === menu ? null : menu));
    },
    []
  );

  // Toggle selection mode
  const handleSelectionModeClick = useCallback(
    (name) => {
      setSelectionMode((prev) => ({
        ...prev,
        activeName: prev.activeName === name ? null : name,
      }));
      setButtonClicked((prev) => (prev === name ? null : name));
    },
    []
  );

  // Toggle right menu visibility and reset selection mode
    // Toggle the right menu (open/close)
    const handleRightMenuToggle = useCallback(() => {
      setRightMenuOpen(prevRightMenuOpen => !prevRightMenuOpen); // Toggle right menu visibility
      handleSelectionModeClick(); // Reset selection mode when toggling the right menu
    }, [handleSelectionModeClick]);

  // Start or stop vehicle animation
  const handleStartStop = useCallback(() => {
    if (!wwd) return;

    if (selectionMode.activeName !== 'Start/Stop') {
      paths.forEach((path) => {
        path.layer.removeAllRenderables();
        wwd.removeLayer(path.layer);
      });
      setPaths([]); // Reset paths

      startVehicleWaypointAnimation(
        placemarks.filter((p) => p.id.startsWith('V')), // Vehicle placemarks
        placemarks.filter((p) => p.name === 'Waypoint'), // Waypoints
        placemarks,
        wwd,
        paths,
        setPaths,
        setPlacemarks,
        setAnimationInterval
      );
    } else {
      paths.forEach((path) => {
        path.layer.removeAllRenderables();
        wwd.removeLayer(path.layer);
      });
      setPaths([]); // Reset paths

      stopVehicleWaypointAnimation(animationInterval, setAnimationInterval);
    }
    wwd.redraw(); // Redraw WorldWind
  }, [selectionMode.activeName, paths, placemarks, wwd, animationInterval]);

  // Redraw WorldWind whenever placemarks or paths change
  useEffect(() => {
    if (wwd) {
      wwd.redraw();
    }
  }, [placemarks, paths, wwd]);

  // Attach click handler to canvas
  useCanvasClickHandler(wwd, selectionMode, setPlacemarks, buttonClicked);

  return (
    <Menu
      handleMenuToggle={handleMenuToggle}
      activeMenu={activeMenu}
      selectionMode={selectionMode}
      handleSelectionModeClick={handleSelectionModeClick}
      handleRightMenuToggle={handleRightMenuToggle}
      buttonClicked={buttonClicked}
      rightMenuOpen={rightMenuOpen}
      activeRightTab={activeRightTab}
      setActiveRightTab={setActiveRightTab}
      placemarks={placemarks}
      setPlacemarks={setPlacemarks}
      handleSelectPlacemark={(id) => handleSelectPlacemark(id, setSelectedPlacemarks)}
      handleDeletePlacemark={(id) => handleDeletePlacemark(id, wwd, setPlacemarks, setSelectedPlacemarks)}
      unassignWaypoint={(id) => unassignWaypoint(id, setPlacemarks, wwd)}
      selectedPlacemarks={selectedPlacemarks}
      paths={paths}
      setSelectedPlacemarks={setSelectedPlacemarks}
      handleStartStop={handleStartStop}
      wwd={wwd}
      globe={globe}
    />
  );
};

export default WorldWindComponent;