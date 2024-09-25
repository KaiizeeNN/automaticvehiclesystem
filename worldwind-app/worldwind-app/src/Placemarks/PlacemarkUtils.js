import WorldWind from 'worldwindjs';

/**
 * Function to create placemark attributes with a custom icon and scale.
 *
 * @param {string} imageSource - The source path for the placemark icon.
 * @returns {WorldWind.PlacemarkAttributes} The created placemark attributes.
 */
export const createPlacemarkAttributes = (imageSource) => {
  const placemarkAttributes = new WorldWind.PlacemarkAttributes(null);
  placemarkAttributes.imageSource = imageSource;
  placemarkAttributes.imageScale = 0.05;
  return placemarkAttributes;
};

/**
 * Function to toggle selection of a placemark by its ID.
 *
 * @param {number} id - The ID of the placemark to select or deselect.
 * @param {function} setSelectedPlacemarks - Function to update the list of selected placemarks.
 */
export const handleSelectPlacemark = (id, setSelectedPlacemarks) => {
  setSelectedPlacemarks(prevSelected => {
    if (prevSelected.includes(id)) {
      return prevSelected.filter(selectedId => selectedId !== id);
    } else {
      return [...prevSelected, id];
    }
  });
};

/**
 * Function to delete a placemark by its ID from the WorldWind viewer.
 *
 * @param {number} id - The ID of the placemark to delete.
 * @param {object} wwd - The WorldWind viewer object.
 * @param {function} setPlacemarks - Function to update the list of placemarks.
 * @param {function} setSelectedPlacemarks - Function to update the list of selected placemarks.
 */
export const handleDeletePlacemark = async (id, wwd, setPlacemarks, setSelectedPlacemarks) => {
  try {
    console.log('Deleting placemark with ID:', id); // Log the ID

    let endpoint = `/api/obstacles/${id}`;

    if (id.startsWith('V')) {
      endpoint = `/api/vehicles/${id}`;
    } else if (id.startsWith('W')) {
      endpoint = `/api/waypoints/${id}`;
    }

    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to delete placemark from backend');
    }

    setPlacemarks(prevPlacemarks => {
      const updatedPlacemarks = prevPlacemarks.filter(placemark => placemark.id !== id);

      // After deleting a vehicle, set associated waypoints' vehicleId to null
      if (id.startsWith('V')) {
        updatedPlacemarks.forEach(placemark => {
          if (placemark.vehicleId === id) {
            placemark.vehicleId = null; // Unassign the waypoint
          }
        });
      }

      // Remove the deleted placemark's layer from WorldWind viewer
      const placemarkToDelete = prevPlacemarks.find(placemark => placemark.id === id);

      if (placemarkToDelete) {
        placemarkToDelete.layer.removeAllRenderables();
        wwd.removeLayer(placemarkToDelete.layer);
        wwd.redraw();
      }

      return updatedPlacemarks;
    });

    // Remove the placemark from selected placemarks
    setSelectedPlacemarks(prevSelected => prevSelected.filter(selectedId => selectedId !== id));

    console.log('Placemark deleted from backend');
  } catch (error) {
    console.error('Error deleting placemark:', error);
  }
};
