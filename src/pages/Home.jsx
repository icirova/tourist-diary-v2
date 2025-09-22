import "./Home.scss";
import Card from "../components/Card";
import data from "../data";
import CardForm from "../components/CardForm";
import { useState } from "react";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
// icons map for converting tag names from the form into image sources
import bag from "/icons/bag.svg";
import bikini from "/icons/bikini.svg";
import bonfire from "/icons/bonfire.svg";
import cafe from "/icons/cafe.svg";
import family from "/icons/family.svg";
import stroller from "/icons/stroller.svg";
import tent from "/icons/tent.svg";
import glutenfree from "/icons/gluten-free.svg";


const Home = () => {
  const tagIconMap = {
    bag,
    bikini,
    bonfire,
    cafe,
    family,
    stroller,
    tent,
    glutenfree,
  };

  const [cardsData, setCardsData] = useState(data);
  const [locations, setLocations] = useState(data);
  const [pickedCoords, setPickedCoords] = useState(null);

  const addCard = (newCard) => {
    setCardsData((prevCards) => {
      const currentIds = prevCards.map((c) => c.id);
      const nextId = currentIds.length ? Math.max(...currentIds) + 1 : 1;

      const mappedTags = (newCard.tags || [])
        .map((name) => tagIconMap[name])
        .filter(Boolean);

      const normalizedDescription = Array.isArray(newCard.description)
        ? newCard.description
        : newCard.description
        ? [newCard.description]
        : [];
      const normalizedNotes = Array.isArray(newCard.notes)
        ? newCard.notes
        : newCard.notes
        ? [newCard.notes]
        : [];
      const normalizedPhotos = Array.isArray(newCard.photos)
        ? newCard.photos
            .filter((photo) => photo && photo.src)
            .map((photo) => ({
              id:
                photo.id || `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
              src: photo.src,
              caption: photo.caption || '',
              name: photo.name || '',
            }))
        : [];

      const created = {
        id: nextId,
        title: newCard.title,
        lat: parseFloat(newCard.lat),
        lng: parseFloat(newCard.lng),
        tags: mappedTags,
        description: normalizedDescription,
        notes: normalizedNotes,
        photos: normalizedPhotos,
      };

      setLocations((prevLocations) => [created, ...prevLocations]);
      return [created, ...prevCards];
    });
  };
  return <div className="container">

      {/* mapa s piny */}
      <Map locations={locations} onPickCoords={(lat, lng) => setPickedCoords({ lat, lng })} />

      {/* formulář pro zadávání nových karet */}
      <CardForm onAddCard={addCard} pickedCoords={pickedCoords} />
        
      {/* Vypisování karet z dat z data.jsx */}
      <div className="cards">
        {cardsData.map((oneCard) => {
          const { id, title, tags, description, notes } = oneCard;
          return (
            <Card
              key={id}
              id={id}
              title={title}
              tags={tags}
              description={description}
              notes={notes}
            ></Card>
          );
        })}
        </div>

        {/* Vysvětlivky */}
      <Sidebar />
        
    </div>
  };

  export default Home
