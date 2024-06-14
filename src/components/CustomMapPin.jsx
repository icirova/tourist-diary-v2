import L from 'leaflet';
import customIconUrl from "/icons/pin.svg";  // Ujisti se, že cesta je správná

const CustomMapPin = new L.Icon({
  iconUrl: customIconUrl,
  iconSize: [25, 41],  // Velikost ikony
  iconAnchor: [12, 41],  // Bod, který bude ukazovat na zeměpisnou pozici
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default CustomMapPin

