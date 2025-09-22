import "./Home.scss";
import { useState } from "react";
import Card from "../components/Card";
import CardForm from "../components/CardForm";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import { useCards } from "../context/CardsContext";


const Home = () => {
  const { cards, addCard, locations } = useCards();
  const [pickedCoords, setPickedCoords] = useState(null);

  return <div className="container">

      {/* mapa s piny */}
      <Map locations={locations} onPickCoords={(lat, lng) => setPickedCoords({ lat, lng })} />

      {/* formulář pro zadávání nových karet */}
      <CardForm onAddCard={addCard} pickedCoords={pickedCoords} />
        
      {/* Vypisování karet z dat z data.jsx */}
      <div className="cards">
        {cards.map((oneCard) => {
          const { id, title, tags, description, notes, lat, lng, photos } = oneCard;
          return (
            <Card
              key={id}
              id={id}
              title={title}
              tags={tags}
              description={description}
              notes={notes}
              lat={lat}
              lng={lng}
              photos={photos}
            ></Card>
          );
        })}
        </div>

        {/* Vysvětlivky */}
      <Sidebar />
        
    </div>
  };

  export default Home
