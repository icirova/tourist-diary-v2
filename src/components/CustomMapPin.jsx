import L from 'leaflet';
import customIconUrl from "/icons/pin-map.svg";

const CustomMapPin = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [25, 41],  
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default CustomMapPin

