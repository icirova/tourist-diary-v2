import "./MapWithForm.scss"
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapWithForm = () => {
  const [locations, setLocations] = useState([
    { id: 1, name: 'Praha', lat: 50.087, lng: 14.421 },
    { id: 2, name: 'Karlův most', lat: 50.0755, lng: 14.4378 },
    // další lokace
  ]);

  const [showForm, setShowForm] = useState(false);
  const [btnText, setBtnText] = useState("+ přidat pin")
  const [formData, setFormData] = useState({
    name: '',
    lat: '',
    lng: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, lat, lng } = formData;
    if (name && lat && lng) {
      const newLocation = {
        id: locations.length + 1,
        name: name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      };
      setLocations([...locations, newLocation]);
      setFormData({ name: '', lat: '', lng: '' });
      setShowForm(false); // Skrytí formuláře po odeslání
    } else {
      alert('Prosím, vyplňte všechny informace.');
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm); // Přepínání viditelnosti formuláře
    setBtnText(showForm ? "+ přidat pin" : "zpět")
  };

  return (
    <div >
      <button className='btn--insert' onClick={toggleForm}>{btnText}</button>
      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <label  className="field-label">
            Název místa:
            <input className="field-input" type="text" name="name" value={formData.name} onChange={handleChange} />
          </label>
          <label  className="field-label">
            Zeměpisná šířka:
            <input  className="field-input" type="text" name="lat" value={formData.lat} onChange={handleChange} />
          </label>
          <label  className="field-label">
            Zeměpisná délka:
            <input  className="field-input" type="text" name="lng" value={formData.lng} onChange={handleChange} />
          </label>
          <button className='btn' type="submit">Přidat Pin</button>
        </form>
      )}

      <div className="map-container">
        <MapContainer center={[50.0755, 14.4378]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {locations.map((location) => (
            <Marker key={location.id} position={[location.lat, location.lng]}>
              <Popup>{location.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

    </div>
  );
};

export default MapWithForm;
