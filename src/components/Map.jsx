import "./Map.scss"
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CustomMapPin from "./CustomMapPin";
import { Link } from "react-router-dom";



const Map= ({locations, onPickCoords}) => {

  const MapClick = () => {
    useMapEvents({
      click(e) {
        if (typeof onPickCoords === 'function' && e?.latlng) {
          onPickCoords(e.latlng.lat, e.latlng.lng);
        }
      }
    });
    return null;
  };


  return (
    <div>
      <MapContainer 
        center={[49.7514919, 15.3264420]} 
        zoom={7}
        style={{ height: '400px', width: '100%' }}
        scrollWheelZoom={false}
        >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClick />
        
        {locations.map((location) => {
          const firstParagraph = Array.isArray(location.description)
            ? location.description[0]
            : location.description;
          return (
            <Marker key={location.id} position={[location.lat, location.lng]} icon={CustomMapPin}>
              <Popup className="popup">
                <strong>{location.title}</strong>
                {firstParagraph && <p>{firstParagraph}</p>}
                <Link to={`/detail/${location.id}`} className="btn btn--primary btn--small btn__popup">Detail</Link>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};


Map.propTypes = {
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
      description: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    })
  ).isRequired,
  onPickCoords: PropTypes.func,
};

export default Map;
