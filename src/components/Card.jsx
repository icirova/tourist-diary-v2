import PropTypes from 'prop-types';
import "./Card.scss";
import { Link } from "react-router-dom";
import TagBadge from './TagBadge';
import { KEY_BY_ICON, TAG_BY_KEY } from '../tags';
import formatCoordinate from '../utils/formatCoordinate';

const toParagraphs = (input, limit) => {
  let paragraphs = [];
  if (Array.isArray(input)) {
    paragraphs = input;
  } else if (typeof input === 'string') {
    paragraphs = input
      .split('\n')
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }
  if (typeof limit === 'number') {
    return paragraphs.slice(0, limit);
  }
  return paragraphs;
};

const resolveTagKey = (value) => {
  if (TAG_BY_KEY[value]) return value;
  return KEY_BY_ICON[value] ?? null;
};

const Card = ({ id, title, tags = [], description, notes, lat, lng, photos = [] }) => {
  const descriptionParagraphs = toParagraphs(description, 2);
  const noteParagraphs = toParagraphs(notes, 2);
  const photoThumbnails = Array.isArray(photos) ? photos.slice(0, 3) : [];

  return (
    <div className="card">
      {/* <p className="card__id">{id}</p> */}
      <h1 className="title">{title}</h1>

      <div className="tags">
        {tags.map((rawTag, index) => {
          const keyName = resolveTagKey(rawTag);
          if (keyName) {
            return <TagBadge key={`${keyName}-${index}`} keyName={keyName} compact />;
          }
          if (typeof rawTag === 'string' && rawTag.endsWith('.svg')) {
            return (
              <img
                className="tag"
                key={`${rawTag}-${index}`}
                src={rawTag}
                alt="tag"
                title="Tag"
              />
            );
          }
          return (
            <span className="tag" key={`${String(rawTag)}-${index}`} title={String(rawTag)}>
              {String(rawTag)}
            </span>
          );
        })}
      </div>

      <div className="perex">
        {descriptionParagraphs.map((paragraph, index) => (
          <p className="paragraph" key={index}>{paragraph}</p>
        ) )}
      </div>
      

      <div className="notes">
      {noteParagraphs.map((paragraph, index) => (
        <p className="paragraph" key={index}>{paragraph}</p>
      ))}

      </div>

      {(lat !== undefined && lat !== null) || (lng !== undefined && lng !== null) ? (
        <div className="card__location">
          Souřadnice:
          <span className="card__coord" title={lat != null ? String(lat) : undefined}>
            {formatCoordinate(lat)}
          </span>
          ,
          <span className="card__coord" title={lng != null ? String(lng) : undefined}>
            {formatCoordinate(lng)}
          </span>
        </div>
      ) : null}

      {photoThumbnails.length > 0 && (
        <div className="card__photo-strip">
          {photoThumbnails.map((photo) => (
            <img
              key={photo.id}
              className="card__photo-thumb"
              src={photo.src}
              alt={photo.caption || photo.name || title}
            />
          ))}
        </div>
      )}


      <Link to={`/detail/${id}`} className="btn btn--primary">Detail</Link>
      
    </div>
  );
};

// Přidání PropTypes pro validaci props
Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string), // pokud description je pole řetězců
    PropTypes.string // pokud přijde jako obyčejný řetězec
  ]),
  notes: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string
  ]),
  lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  photos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      src: PropTypes.string,
      caption: PropTypes.string,
      name: PropTypes.string,
    }),
  ),
};

export default Card;
