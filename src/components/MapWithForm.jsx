import "./MapWithForm.scss"
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from "../data"

const MapWithForm= () => {
  const [locations, setLocations] = useState(data);

  const [formData, setFormData] = useState({
    title: '',
    lat: '',
    lng: '',
    description: '',
  });

  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { title, lat, lng, description } = formData;
    if (title && lat && lng && description) {
      const newLocation = {
        id: locations.length + 1,
        title: title,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        description: description,
      };
      setLocations([...locations, newLocation]);
      setFormData({ title: '', lat: '', lng: '', description: '' });
      setShowForm(false);
    } else {
      alert('Prosím, vyplňte všechny informace.');
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

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

      {/* <button className="btn--insert" onClick={toggleForm}>+ Přidat nové místo</button>

      {showForm && (
        <form className="form" onSubmit={handleSubmit}>
          <label>
            Název místa:
            <input type="text" name="name" value={formData.title} onChange={handleChange} />
          </label>
          <label>
            Zeměpisná šířka:
            <input type="text" name="lat" value={formData.lat} onChange={handleChange} />
          </label>
          <label>
            Zeměpisná délka:
            <input type="text" name="lng" value={formData.lng} onChange={handleChange} />
          </label>
          <label>
            Popis:
            <textarea name="description" value={formData.description} onChange={handleChange} />
          </label>
          <button className="btn" type="submit">Přidat</button>
        </form>
      )}
      
      <div className="cards">
        {locations.map((location) => (
          <div className="card" key={location.id}>
            <h3>{location.title}</h3>
            <p>{location.description}</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default MapWithForm;
