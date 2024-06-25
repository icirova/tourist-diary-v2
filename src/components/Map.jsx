import "./Map.scss"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomMapPin from "./CustomMapPin";
import { Link } from "react-router-dom";



const Map= ({locations}) => {


  return (
    <div>
      <MapContainer 
        center={[49.7514919, 15.3264420]} 
        zoom={7}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={false}
        >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        {locations.map((location) => (
          <Marker key={location.id} position={[location.lat, location.lng]} icon={CustomMapPin}>
            <Popup className="popup">
              <strong>{location.title}</strong>
              <p>{location.description}</p>
              <Link to={`/detail/${location.id}`} className=" btn btn__popup">Více</Link>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
