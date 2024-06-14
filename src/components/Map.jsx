import "./Map.scss"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const Map= ({locations}) => {
 
  return (
    <div>
     
      
      <MapContainer center={[49.9066213, 15.8054397]} zoom={7} style={{ height: '400px', width: '100%' }}>
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

export default Map;
