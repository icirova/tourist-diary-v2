import PropTypes from 'prop-types';
import "./Card.scss";
import { Link } from "react-router-dom";
import TagBadge from './TagBadge';
import { resolveTagKey } from '../tags';
import { limitParagraphs } from '../utils/text';
import { PhotoPropType, TagKeyPropType } from '../types/cardPropTypes';

const Card = ({ id, title, tags = [], description, photos = [] }) => {
  const descriptionParagraphs = limitParagraphs(description, 1);
  const photoList = Array.isArray(photos) ? photos : [];
  const primaryPhoto = photoList[0];
  const remainingPhotoCount = Math.max(photoList.length - 1, 0);

  return (
    <div className="card">
      {primaryPhoto && (
        <Link to={`/detail/${id}`} className="card__media" aria-label={`Zobrazit detail: ${title}`}>
          <img
            className="card__image"
            src={primaryPhoto.src}
            alt={primaryPhoto.caption || primaryPhoto.name || title}
          />
          {remainingPhotoCount > 0 && (
            <span className="card__photo-count">+{remainingPhotoCount}</span>
          )}
        </Link>
      )}

      <div className="card__body">
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

        <div className="card__footer">
          <Link to={`/detail/${id}`} className="btn btn--primary">Detail</Link>
        </div>
      </div>
    </div>
  );
};

// Přidání PropTypes pro validaci props
Card.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(TagKeyPropType),
  description: PropTypes.arrayOf(PropTypes.string),
  photos: PropTypes.arrayOf(PhotoPropType),
};

Card.defaultProps = {
  tags: [],
  description: [],
  photos: [],
};

export default Card;
