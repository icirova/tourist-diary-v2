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

  return <main className="home-page">
      <section className="home-page__overview" aria-label="Přehled výletů">
        <div className="home-page__map-panel">
          <div className="home-page__section-heading">
            <div>
              <p className="home-page__eyebrow">Mapa výletů</p>
              <h2>Objevujte uložená místa</h2>
            </div>
            <div className="home-page__map-actions">
              <div className="home-page__stats" aria-label="Souhrn deníku">
                <span>{cards.length} výletů</span>
                <span>{locations.length} míst na mapě</span>
              </div>
              {isAuthenticated ? (
                <CardForm onAddCard={addCard} pickedCoords={pickedCoords} />
              ) : (
                <p className="auth-hint auth-hint--subtle">
                  {isLoading
                    ? 'Ověřujeme přihlášení...'
                    : 'Přihlášení odemkne přidávání výletů.'}
                </p>
              )}
              {hasError && (
                <p className="auth-hint auth-hint--subtle auth-hint--error">
                  Přihlášení se nepodařilo propojit.
                </p>
              )}
            </div>
          </div>
          <Map
            locations={filteredLocations}
            onPickCoords={
              isAuthenticated ? (lat, lng) => setPickedCoords({ lat, lng }) : undefined
            }
          />
        </div>
      </section>

      <section className="home-page__library" aria-label="Seznam výletů">
        <div className="home-page__section-heading home-page__section-heading--library">
          <div>
            <p className="home-page__eyebrow">Deník</p>
            <h2>Uložené výlety</h2>
          </div>
          <span className="home-page__count">{filteredCards.length} zobrazeno</span>
        </div>

        <div className="home-page__tools" aria-label="Nástroje deníku">
          <CardFilters
            activeTags={activeTags}
            onChange={setActiveTags}
            resultCount={filteredCards.length}
            totalCount={cards.length}
          />
          <AiAssistant />
        </div>

        <div className="cards">
          {filteredCards.map((oneCard) => {
            const { id, title, tags, description, photos } = oneCard;
            return (
              <Card
                key={id}
                id={id}
                title={title}
                tags={tags}
                description={description}
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
      </section>
    </main>
  };

  export default Home
