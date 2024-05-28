import "./MapComponent.scss"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ locations }) => {
  return (
    <MapContainer center={[50.0755, 14.4378]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((location, idx) => (
        <Marker key={idx} position={[location.lat, location.lng]}>
          <Popup>
            {location.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
