/*import React, { useEffect, useState, useCallback } from 'react';
import WorldWind from 'worldwindjs';
import { addPlacemark } from './PlacemarkUtils'; // Import only the necessary functions
import './styles.css';

const WorldWindComponent = () => {
  const [selectionMode, setSelectionMode] = useState(false);
  const [wwd, setWwd] = useState(null);
  const [menus, setMenus] = useState({
    menu1: false, // 4 buttons
    menu2: false, // 2 buttons
  });

  useEffect(() => {
    const wwdInstance = new WorldWind.WorldWindow("canvasOne");

    wwdInstance.addLayer(new WorldWind.BMNGOneImageLayer());
    wwdInstance.addLayer(new WorldWind.BMNGLayer());
    wwdInstance.addLayer(new WorldWind.BingAerialLayer());
    wwdInstance.addLayer(new WorldWind.AtmosphereLayer());
    wwdInstance.addLayer(new WorldWind.CompassLayer());
    wwdInstance.addLayer(new WorldWind.CoordinatesDisplayLayer(wwdInstance));

    setWwd(wwdInstance);
  }, []);

  const handleCanvasClick = useCallback((event) => {
    if (selectionMode && wwd) {
      const x = event.clientX;
      const y = event.clientY;
      const pickList = wwd.pickTerrain(wwd.canvasCoordinates(x, y));

      if (pickList.objects.length > 0 && pickList.objects[0].isTerrain) {
        const position = pickList.objects[0].position;
        addPlacemark(wwd, position, () => {}); // Use a dummy function for setPlacemark
      }
    }
  }, [selectionMode, wwd]);

  const suppressNavigator = () => {
    wwd.worldWindowController.__mouseDownHandler = wwd.worldWindowController.handleMouseDown;
    wwd.worldWindowController.__mouseMoveHandler = wwd.worldWindowController.handleMouseMove;
    wwd.worldWindowController.__mouseUpHandler = wwd.worldWindowController.handleMouseUp;

    wwd.worldWindowController.handleMouseDown = function () {};
    wwd.worldWindowController.handleMouseMove = function () {};
    wwd.worldWindowController.handleMouseUp = function () {};
  };

  const restoreNavigator = () => {
    wwd.worldWindowController.handleMouseDown = wwd.worldWindowController.__mouseDownHandler;
    wwd.worldWindowController.handleMouseMove = wwd.worldWindowController.__mouseMoveHandler;
    wwd.worldWindowController.handleMouseUp = wwd.worldWindowController.__mouseUpHandler;
  };

  const handleMenuToggle = (menu) => {
    setMenus(prevMenus => ({
      ...prevMenus,
      [menu]: !prevMenus[menu]
    }));
  };

  const handleSelectionModeClick = () => {
    setSelectionMode(!selectionMode);
    if (!selectionMode) {
      suppressNavigator();
    } else {
      restoreNavigator();
    }
  };

  useEffect(() => {
    if (wwd) {
      wwd.addEventListener("click", handleCanvasClick);
    }
    return () => {
      if (wwd) {
        wwd.removeEventListener("click", handleCanvasClick);
      }
    };
  }, [wwd, handleCanvasClick]);

  return (
    <div id="canvas-container">
      <canvas id="canvasOne"></canvas>
      <div id="button-container">
        <div className="menu-toggle">
          <button className="menu-button menu-button-toggle" onClick={() => handleMenuToggle('menu1')}>
            Menu 1
          </button>
          {menus.menu1 && (
            <div className="menu-content">
              <button className="menu-button">Button 1</button>
              <button className="menu-button">Button 2</button>
              <button className="menu-button">Button 3</button>
              <button className="menu-button">Button 4</button>
            </div>
          )}
        </div>

        <div className="menu-toggle">
          <button className="menu-button" onClick={() => handleMenuToggle('menu2')}>
            Menu 2
          </button>
          {menus.menu2 && (
            <div className="menu-content">
              <button className="menu-button">Button A</button>
              <button className="menu-button">Button B</button>
            </div>
          )}
        </div>

        <button className="menu-button" onClick={handleSelectionModeClick}>
          {selectionMode ? 'Deactivate' : 'Activate'}
        </button>

        <button className="menu-button">
          Menu 4
        </button>
      </div>
    </div>
  );
};

export default WorldWindComponent;


*/