import { useState, useCallback, useEffect, useRef } from 'react';
import '../../../styles.css';

// Custom hook for handling vehicle movement with WASD and Joystick
const useVehicleMovement = (vehicles, setPlacemarks, wwd, handleTogglePlacemarkSelection) => {
    const [selectedVehiclePosition, setSelectedVehiclePosition] = useState(null);
    const [isMovementModeActive, setIsMovementModeActive] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null);

    const pressedKeysRef = useRef(new Set());
    const animationFrameRef = useRef(null);
    const gamepadIndexRef = useRef(null); // Store the gamepad index

    const toRadians = (degrees) => degrees * (Math.PI / 180);

    const handleMovementModeClick = useCallback((vehicleId) => {
        if (selectedVehicleId && selectedVehicleId !== vehicleId) {
            setIsMovementModeActive(false);
        }

        const selectedVehicle = vehicles.find(vehicle => vehicle.id === vehicleId);
        if (selectedVehicle) {
            setSelectedVehiclePosition(selectedVehicle.position);
        }

        setSelectedVehicleId(vehicleId);
        setIsMovementModeActive(prevState => !prevState);
        pressedKeysRef.current.clear();
    }, [vehicles, selectedVehicleId]);

    const updateVehiclePosition = useCallback((vehicleId, newPosition) => {
        fetch(`http://localhost:3000/api/vehicles/${vehicleId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: vehicleId,
                latitude: newPosition.latitude,
                longitude: newPosition.longitude,
            }),
        })
        .then(response => {
            if (!response.ok) {
                console.error('Failed to update vehicle position');
            }
        })
        .catch(error => {
            console.error('Error updating vehicle:', error);
        });
    }, []);

    const handleKeyDown = useCallback((event) => {
        if (!isMovementModeActive) return;
        const key = event.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) {
            pressedKeysRef.current.add(key);
        }
    }, [isMovementModeActive]);

    const handleKeyUp = useCallback((event) => {
        const key = event.key.toLowerCase();
        if (['w', 'a', 's', 'd'].includes(key)) {
            pressedKeysRef.current.delete(key);
        }
    }, []);

    const moveVehicle = useCallback(() => {
      if (!selectedVehiclePosition || !isMovementModeActive) {
          animationFrameRef.current = requestAnimationFrame(moveVehicle);
          return;
      }
  
      let { latitude, longitude } = selectedVehiclePosition;
      const speedKmh = 2000;
      const speedKms = speedKmh / 3600;
      const earthRadiusKm = 6371;
      const stepKm = speedKms * (1 / 60);
      const stepDegLat = (stepKm / earthRadiusKm) * (180 / Math.PI);
      const stepDegLon = stepDegLat / Math.cos(toRadians(latitude));
  
      let latChange = 0;
      let lonChange = 0;
  
      // Handle Gamepad input (left stick)
      const gamepads = navigator.getGamepads();
      if (gamepadIndexRef.current !== null) {
          const gamepad = gamepads[gamepadIndexRef.current];
          if (gamepad) {
              const [leftStickX, leftStickY] = gamepad.axes;
  
              // Dead zone threshold to avoid drift
              const deadZone = 0.01;
              const joystickSensitivity = 1; // Increase for faster movement response
  
              if (Math.abs(leftStickX) > deadZone) {
                  lonChange += leftStickX * stepDegLon * joystickSensitivity;
              }
              if (Math.abs(leftStickY) > deadZone) {
                  latChange -= leftStickY * stepDegLat * joystickSensitivity; // Invert Y for correct behavior
              }
              if (gamepad.buttons[12].pressed) latChange += stepDegLat; // D-pad Up
              if (gamepad.buttons[13].pressed) latChange -= stepDegLat; // D-pad Down
              if (gamepad.buttons[14].pressed) lonChange -= stepDegLon; // D-pad Left
              if (gamepad.buttons[15].pressed) lonChange += stepDegLon; // D-pad Right
          }
      }
  
      //WASD
      if (pressedKeysRef.current.has('w')) latChange += stepDegLat;
      if (pressedKeysRef.current.has('s')) latChange -= stepDegLat;
      if (pressedKeysRef.current.has('a')) lonChange -= stepDegLon;
      if (pressedKeysRef.current.has('d')) lonChange += stepDegLon;
  
      // Adjust for diagonal movement with WASD
      if ((pressedKeysRef.current.has('w') || pressedKeysRef.current.has('s')) && 
          (pressedKeysRef.current.has('a') || pressedKeysRef.current.has('d'))) {
          latChange *= Math.SQRT1_2;
          lonChange *= Math.SQRT1_2;
      }
  
      const newPosition = {
          latitude: latitude + latChange,
          longitude: longitude + lonChange
      };
  
      setSelectedVehiclePosition(newPosition);
      updateVehiclePosition(selectedVehicleId, newPosition);
  
      const vehiclePlacemark = vehicles.find(v => v.id === selectedVehicleId);
      if (vehiclePlacemark) {
          vehiclePlacemark.position.latitude = newPosition.latitude;
          vehiclePlacemark.position.longitude = newPosition.longitude;
      }
  
      wwd.redraw();
  
      animationFrameRef.current = requestAnimationFrame(moveVehicle);
  }, [selectedVehiclePosition, isMovementModeActive, selectedVehicleId, vehicles, updateVehiclePosition, wwd]);
  

    // Poll gamepads and set up event listeners
    useEffect(() => {
        const handleGamepadConnected = (event) => {
            gamepadIndexRef.current = event.gamepad.index;
        };

        const handleGamepadDisconnected = () => {
            gamepadIndexRef.current = null;
        };

        window.addEventListener('gamepadconnected', handleGamepadConnected);
        window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);

        return () => {
            window.removeEventListener('gamepadconnected', handleGamepadConnected);
            window.removeEventListener('gamepaddisconnected', handleGamepadDisconnected);
        };
    }, []);

    // Set up key listeners and start the animation loop when movement mode is active
    useEffect(() => {
        if (isMovementModeActive) {
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            animationFrameRef.current = requestAnimationFrame(moveVehicle);
            return () => {
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
                cancelAnimationFrame(animationFrameRef.current);
            };
        }
    }, [isMovementModeActive, handleKeyDown, handleKeyUp, moveVehicle]);

    return {
        isMovementModeActive,
        handleMovementModeClick,
        updateVehiclePosition
    };
};

export default useVehicleMovement;
