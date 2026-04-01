import PropTypes from 'prop-types';
import './CardFilters.scss';
import TagBadge from './TagBadge';
import { TAGS } from '../tags';

const CardFilters = ({ activeTags, onChange, resultCount, totalCount }) => {
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

  return (
    <section className="card-filters" aria-label="Filtrování výletů">
      <div className="card-filters__header">
        <div>
          <h2 className="card-filters__title">Filtrovat výlety</h2>
          <p className="card-filters__meta">
            {hasFilters
              ? `Zobrazeno ${resultCount} z ${totalCount} výletů.`
              : `Zobrazeno všech ${totalCount} výletů.`}
          </p>
        </div>
        <button
          type="button"
          className="btn btn--secondary btn--small"
          onClick={clearFilters}
          disabled={!hasFilters}
        >
          Zrušit filtry
        </button>
      </div>

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
