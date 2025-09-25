import "./Home.scss";
import { useEffect, useState } from "react";
import Card from "../components/Card";
import CardForm from "../components/CardForm";
import Map from "../components/Map";
import Sidebar from "../components/Sidebar";
import { useCards } from "../context/CardsContext";
import { useAuth } from "../context/AuthContext";


const Home = () => {
  const { cards, addCard, locations } = useCards();
  const { isAuthenticated } = useAuth();
  const [pickedCoords, setPickedCoords] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setPickedCoords(null);
    }
  }, [isAuthenticated]);

  return <div className="container">

      {/* mapa s piny */}
      <Map
        locations={locations}
        onPickCoords={
          isAuthenticated ? (lat, lng) => setPickedCoords({ lat, lng }) : undefined
        }
      />

      {/* formulář pro zadávání nových karet */}
      {isAuthenticated ? (
        <CardForm onAddCard={addCard} pickedCoords={pickedCoords} />
      ) : (
        <p className="auth-hint">
          Přihlaste se, abyste mohli přidávat vlastní zážitky.
        </p>
      )}
        
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
