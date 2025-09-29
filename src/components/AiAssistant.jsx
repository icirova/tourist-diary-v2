import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './AiAssistant.scss';
import { useAiAssistant } from '../context/AiAssistantContext';
import { useCards } from '../context/CardsContext';
import formatCoordinate from '../utils/formatCoordinate';

const ResultCard = ({ card }) => {
  const description = Array.isArray(card.description) ? card.description[0] : card.description;

  return (
    <div className="ai-assistant__result">
      <div className="ai-assistant__result-body">
        <h4 className="ai-assistant__result-title">{card.title}</h4>
        {description && <p className="ai-assistant__result-text">{description}</p>}
        {(card.lat !== undefined && card.lng !== undefined) && (
          <p className="ai-assistant__result-coords">
            {formatCoordinate(card.lat)}, {formatCoordinate(card.lng)}
          </p>
        )}
      </div>
      <Link className="btn btn--secondary btn--small" to={`/detail/${card.id}`}>
        Detail
      </Link>
    </div>
  );
};

ResultCard.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
    lat: PropTypes.number,
    lng: PropTypes.number,
  }).isRequired,
};

const AiAssistant = () => {
  const { askAssistant, lastAnswer, status, error } = useAiAssistant();
  const { cards } = useCards();
  const [prompt, setPrompt] = useState('');

  const recommendations = useMemo(() => {
    if (!lastAnswer) return [];
    return lastAnswer.recommendations
      .map((id) => cards.find((card) => String(card.id) === String(id)))
      .filter(Boolean);
  }, [lastAnswer, cards]);

  const isLoading = status === 'loading';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const entry = await askAssistant(prompt);
    if (entry) {
      setPrompt('');
    }
  };

  return (
    <section className="ai-assistant" aria-live="polite">
      <div className="ai-assistant__header">
        <h2 className="ai-assistant__title">AI průvodce výlety</h2>
        <p className="ai-assistant__subtitle">
          Popište, co chcete zažít, a průvodce navrhne výlety z vašeho deníku.
        </p>
      </div>

      <form className="ai-assistant__form" onSubmit={handleSubmit}>
        <label htmlFor="ai-query" className="ai-assistant__label">
          Zadání
        </label>
        <textarea
          id="ai-query"
          className="ai-assistant__input"
          rows="4"
          placeholder="Například: procházka v přírodě s možností občerstvení a bezlepkové nabídky"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          disabled={isLoading}
        />
        <button type="submit" className="btn btn--primary" disabled={isLoading}>
          {isLoading ? 'Hledám tipy...' : 'Najít výlety'}
        </button>
      </form>

      {error && <p className="ai-assistant__error">{error}</p>}

      {status === 'idle' && !lastAnswer && (
        <p className="ai-assistant__hint">
          Doporučení se zobrazí zde. Zkuste zmínit aktivitu, typ skupiny nebo praktické požadavky.
        </p>
      )}

      {isLoading && (
        <p className="ai-assistant__loading">Zpracovávám vaše zadání...</p>
      )}

      {status === 'resolved' && lastAnswer && (
        <div className="ai-assistant__results">
          <p className="ai-assistant__reasoning">{lastAnswer.reasoning}</p>
          {recommendations.length > 0 ? (
            recommendations.map((card) => <ResultCard key={card.id} card={card} />)
          ) : (
            <p className="ai-assistant__empty">Zkuste zadat jiné klíčové slovo nebo lokalitu.</p>
          )}
        </div>
      )}
    </section>
  );
};

export default AiAssistant;
