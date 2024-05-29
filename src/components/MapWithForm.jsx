import "./MapWithForm.scss"
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapWithForm= ({locations}) => {
 
{console.log(locations)}
  return (
    <div>
     
      
      <MapContainer center={[50.0755, 14.4378]} zoom={13} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {locations.map((location) => (
          <Marker key={location.id} position={[location.lat, location.lng]}>
            <Popup>
              <strong>{location.title}</strong>
              <p>{location.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

     
    </div>
  );
};

export default MapWithForm;
