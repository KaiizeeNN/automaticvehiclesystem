import { useEffect, useCallback } from 'react';
import { addPlacemark, addAssignedWaypoint } from './Placemarks/placemarkService';

export const useCanvasClickHandler = (wwd, selectionMode, setPlacemarks, buttonClicked, selectedVehicleId) => {
  const handleCanvasClick = useCallback((event) => {
    console.log("Canvas clicked");
    console.log("selectionMode:", selectionMode);
    console.log("buttonClicked:", buttonClicked);
    console.log("selectedVehicleId in handleCanvasClick:", selectedVehicleId);

    if (selectionMode.activeName && wwd) {
      const canvasCoords = wwd.canvasCoordinates(event.clientX, event.clientY);
      const pickList = wwd.pickTerrain(canvasCoords);

      if (pickList.objects.length > 0 && pickList.objects[0].isTerrain) {
        const position = pickList.objects[0].position;

        if (position.altitude < 0 || position.altitude > 10000) {
          console.warn("Unusual altitude value:", position.altitude);
          return;
        }

        // Check if the button clicked is 'Waypoint' and a vehicle is selected
        if ((buttonClicked === 'New Waypoint')) {
            if(selectedVehicleId)
            {
              console.log("Attempting to add assigned waypoint");
              let placemarkName = 'Waypoint';
              let imageSource = "/images/waypoint.png";
              addAssignedWaypoint(wwd, position, setPlacemarks, placemarkName, imageSource, selectedVehicleId);
            }
            
          
        } else if ((buttonClicked==='Waypoint' 
          ||  buttonClicked==='Enemy Ground' 
          ||   buttonClicked==='Enemy Air' 
          ||   buttonClicked==='Alliance Ground' 
          || buttonClicked==='Alliance Air'
          || buttonClicked === 'Obstacle')
          && !selectedVehicleId){
          // If it's not 'Waypoint', handle other placemarks
          console.log("Adding regular placemark");
          let placemarkName = buttonClicked || 'Unnamed';
          let imageSource = "/images/tank.png"; // Default image source
          if (buttonClicked === 'Enemy Ground') {
            imageSource = "/images/tank-red.png";
          } else if (buttonClicked === 'Enemy Air') {
            imageSource = "/images/airplane-red.png";
          } else if (buttonClicked === 'Alliance Air') {
            imageSource = "/images/airplane.png";
          }
          else if (buttonClicked === 'Waypoint') {
            imageSource = "/images/waypoint.png";
          }
          else if(buttonClicked==='Obstacle'){
            imageSource="/images/obstacle.png"
          }

          addPlacemark(wwd, position, setPlacemarks, placemarkName, imageSource);
        }
      } else {
        console.warn("No terrain data found at the clicked position.");
      }
    }
  }, [selectionMode, wwd, setPlacemarks, buttonClicked, selectedVehicleId]);

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
};
