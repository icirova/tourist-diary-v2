import PropTypes from 'prop-types';
import "./Card.scss";
import { Link } from "react-router-dom";
import TagBadge from './TagBadge';
import { resolveTagKey } from '../tags';
import formatCoordinate from '../utils/formatCoordinate';
import { limitParagraphs } from '../utils/text';
import { PhotoPropType, TagKeyPropType } from '../types/cardPropTypes';

const Card = ({ id, title, tags = [], description, notes, lat, lng, photos = [] }) => {
  const descriptionParagraphs = limitParagraphs(description, 2);
  const noteParagraphs = limitParagraphs(notes, 2);
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
  tags: PropTypes.arrayOf(TagKeyPropType),
  description: PropTypes.arrayOf(PropTypes.string),
  notes: PropTypes.arrayOf(PropTypes.string),
  lat: PropTypes.number,
  lng: PropTypes.number,
  photos: PropTypes.arrayOf(PhotoPropType),
};

Card.defaultProps = {
  tags: [],
  description: [],
  notes: [],
  lat: undefined,
  lng: undefined,
  photos: [],
};

export default Card;
