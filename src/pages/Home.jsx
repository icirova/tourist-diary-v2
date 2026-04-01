import "./Home.scss";
import { useEffect, useMemo, useState } from "react";
import Card from "../components/Card";
import CardForm from "../components/CardForm";
import Map from "../components/Map";
import { useCards } from "../context/CardsContext";
import { useAuth } from "../context/AuthContext";
import AiAssistant from "../components/AiAssistant";
import CardFilters from "../components/CardFilters";


const Home = () => {
  const { cards, addCard, locations } = useCards();
  const { isAuthenticated, isLoading, hasError } = useAuth();
  const [pickedCoords, setPickedCoords] = useState(null);
  const [activeTags, setActiveTags] = useState([]);

  const filteredCards = useMemo(() => {
    if (!activeTags.length) return cards;
    return cards.filter((card) =>
      activeTags.every((tag) => Array.isArray(card.tags) && card.tags.includes(tag))
    );
  }, [activeTags, cards]);

  const filteredLocations = useMemo(() => {
    if (!activeTags.length) return locations;
    const visibleCardIds = new Set(filteredCards.map((card) => String(card.id)));
    return locations.filter((location) => visibleCardIds.has(String(location.id)));
  }, [activeTags, filteredCards, locations]);

  useEffect(() => {
    if (!isAuthenticated) {
      setPickedCoords(null);
    }
  }, [isAuthenticated]);

  return <div className="container home-page">

      <div className="home-page__intro">
        {/* mapa s piny */}
        <Map
          locations={filteredLocations}
          onPickCoords={
            isAuthenticated ? (lat, lng) => setPickedCoords({ lat, lng }) : undefined
          }
        />

        {/* AI průvodce */}
        <AiAssistant />
      </div>

      {/* formulář pro zadávání nových karet */}
      {isAuthenticated ? (
        <CardForm onAddCard={addCard} pickedCoords={pickedCoords} />
      ) : (
        <p className="auth-hint">
          {isLoading
            ? 'Ověřujeme přihlášení...'
            : 'Přihlaste se, abyste mohli přidávat vlastní zážitky.'}
        </p>
      )}

      {hasError && (
        <p className="auth-hint auth-hint--error">
          Nepodařilo se propojit přihlášení. Zkuste to prosím znovu později.
        </p>
      )}

      <CardFilters
        activeTags={activeTags}
        onChange={setActiveTags}
        resultCount={filteredCards.length}
        totalCount={cards.length}
      />
        
      {/* Vypisování karet z dat z data.jsx */}
      <div className="cards">
        {filteredCards.map((oneCard) => {
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

      {filteredCards.length === 0 && (
        <p className="cards-empty">
          Zvoleným tagům teď neodpovídá žádný výlet. Zkuste některý filtr vypnout.
        </p>
      )}
    </div>
  };

  export default Home
