import PropTypes from 'prop-types';
import { useState } from 'react';
import './CardFilters.scss';
import TagBadge from './TagBadge';
import { TAGS } from '../tags';

const CardFilters = ({ activeTags, onChange, resultCount, totalCount }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTag = (tagKey) => {
    const isActive = activeTags.includes(tagKey);
    if (isActive) {
      onChange(activeTags.filter((tag) => tag !== tagKey));
      return;
    }
    onChange([...activeTags, tagKey]);
  };

  const clearFilters = () => onChange([]);

  const hasFilters = activeTags.length > 0;
  const panelId = 'trip-filter-panel';

  return (
    <section className={`card-filters ${isOpen ? 'card-filters--open' : ''}`} aria-label="Filtrování výletů">
      <div className="card-filters__header">
        <div>
          <h2 className="card-filters__title">Filtrovat výlety</h2>
          <p className="card-filters__meta">
            {hasFilters
              ? `Zobrazeno ${resultCount} z ${totalCount} výletů.`
              : `Zobrazeno všech ${totalCount} výletů.`}
          </p>
        </div>
        <div className="card-filters__actions">
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls={panelId}
          >
            {isOpen ? 'Skrýt filtry' : 'Filtrovat'}
          </button>
          <button
            type="button"
            className="btn btn--secondary btn--small"
            onClick={clearFilters}
            disabled={!hasFilters}
          >
            Zrušit
          </button>
        </div>
      </div>

      {hasFilters && (
        <div className="card-filters__active" aria-label="Aktivní filtry">
          {activeTags.map((tagKey) => (
            <button
              key={tagKey}
              type="button"
              className="card-filters__active-item"
              onClick={() => toggleTag(tagKey)}
              title="Odebrat filtr"
            >
              <TagBadge keyName={tagKey} />
              <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div id={panelId} className="card-filters__panel">
          <p className="card-filters__hint">Karta musí obsahovat všechny vybrané tagy.</p>

          <div className="card-filters__list">
            {TAGS.map((tag) => {
              const isActive = activeTags.includes(tag.key);
              return (
                <button
                  key={tag.key}
                  type="button"
                  className={`card-filters__option ${isActive ? 'card-filters__option--active' : ''}`}
                  onClick={() => toggleTag(tag.key)}
                  aria-pressed={isActive}
                  title={tag.tooltip}
                >
                  <TagBadge keyName={tag.key} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

CardFilters.propTypes = {
  activeTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
};

export default CardFilters;
