import React from 'react';
import '../../styles.css';

const ObstaclesTab = ({ 
  obstacles, 
  handleDeletePlacemark,
  selectedPlacemarks,
  handleTogglePlacemarkSelection
}) => {
  return (
    <div className="tab-content">
      <h3>Obstacles</h3>
      <ul>
        {obstacles.map(obstacle => (
          <li key={obstacle.id} className="placemark-item">
            <div className="placemark-details">
              <span>Type: {obstacle.name}</span>
              <div>Id: {obstacle.id}</div>
              <div>Lat: {obstacle.position.latitude.toFixed(4)}</div>
              <div>Lon: {obstacle.position.longitude.toFixed(4)}</div>
            </div>
            <button className="placemarkDeleteButton" onClick={() => handleDeletePlacemark(obstacle.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ObstaclesTab;
