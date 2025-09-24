import PropTypes from 'prop-types';
import "./CardOpen.scss";
import { Link, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import TagBadge from './TagBadge';
import { TAGS, resolveTagKey } from '../tags';
import CustomMapPin from './CustomMapPin';
import formatCoordinate from '../utils/formatCoordinate';
import { useCards } from '../context/CardsContext';

const DEFAULT_CENTER = [49.7514919, 15.326442];

const generatePhotoId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const normaliseText = (value) => (Array.isArray(value) ? value.join("\n") : value || '');

const toArray = (val) => {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    return val
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const normalisePhotos = (photos) => {
  if (!Array.isArray(photos)) return [];
  return photos
    .filter((photo) => photo && photo.src)
    .map((photo) => ({
      id: photo.id || generatePhotoId(),
      src: photo.src,
      caption: photo.caption || '',
      name: photo.name || '',
    }));
};

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: generatePhotoId(),
        src: reader.result,
        caption: '',
        name: file.name,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const EditableLocationMap = ({ lat, lng, onPick }) => {
  const numericLat = Number(lat);
  const numericLng = Number(lng);
  const hasValidCoords = Number.isFinite(numericLat) && Number.isFinite(numericLng);
  const center = hasValidCoords ? [numericLat, numericLng] : DEFAULT_CENTER;

  const MapClick = () => {
    useMapEvents({
      click(e) {
        if (typeof onPick === 'function' && e?.latlng) {
          onPick(e.latlng.lat, e.latlng.lng);
        }
      },
    });
    return null;
  };

  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={hasValidCoords ? 11 : 7}
        style={{ height: '300px', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClick />
        {hasValidCoords && (
          <Marker position={[numericLat, numericLng]} icon={CustomMapPin} />
        )}
      </MapContainer>
    </div>
  );
};

EditableLocationMap.propTypes = {
  lat: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lng: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onPick: PropTypes.func,
};

const validate = ({ title, lat, lng }) => {
  const errors = {};
  if (!title || title.trim() === '') {
    errors.title = 'Povinné pole.';
  }
  const latFloat = parseFloat(lat);
  if (lat === '' || Number.isNaN(latFloat)) {
    errors.lat = 'Povinné pole.';
  } else if (latFloat < -90 || latFloat > 90) {
    errors.lat = 'Mimo rozsah (−90 až 90).';
  }
  const lngFloat = parseFloat(lng);
  if (lng === '' || Number.isNaN(lngFloat)) {
    errors.lng = 'Povinné pole.';
  } else if (lngFloat < -180 || lngFloat > 180) {
    errors.lng = 'Mimo rozsah (−180 až 180).';
  }
  return errors;
};

const CardOpenContent = ({ card, onSave }) => {
  const tagOptions = useMemo(() => TAGS, []);
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(card.title);
  const [localDescription, setLocalDescription] = useState(normaliseText(card.description));
  const [localNotes, setLocalNotes] = useState(normaliseText(card.notes));
  const [selectedTags, setSelectedTags] = useState(
    (card.tags || [])
      .map((tag) => resolveTagKey(tag))
      .filter(Boolean)
  );
  const [localLat, setLocalLat] = useState(
    card.lat !== undefined && card.lat !== null ? String(card.lat) : ''
  );
  const [localLng, setLocalLng] = useState(
    card.lng !== undefined && card.lng !== null ? String(card.lng) : ''
  );
  const [localPhotos, setLocalPhotos] = useState(normalisePhotos(card.photos));
  const [errors, setErrors] = useState({});
  const [activePhotoIndex, setActivePhotoIndex] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const viewPhotos = useMemo(() => normalisePhotos(card.photos), [card.photos]);

  useEffect(() => {
    if (!isEditing) {
      setActivePhotoIndex(null);
      setIsGalleryOpen(false);
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing) return;
    setLocalTitle(card.title);
    setLocalDescription(normaliseText(card.description));
    setLocalNotes(normaliseText(card.notes));
    setSelectedTags(
      (card.tags || [])
        .map((tag) => resolveTagKey(tag))
        .filter(Boolean)
    );
    setLocalLat(card.lat !== undefined && card.lat !== null ? String(card.lat) : '');
    setLocalLng(card.lng !== undefined && card.lng !== null ? String(card.lng) : '');
    setLocalPhotos(normalisePhotos(card.photos));
  }, [card, isEditing]);

  useEffect(() => {
    if (!isGalleryOpen) return;
    if (!viewPhotos.length) {
      setActivePhotoIndex(null);
      setIsGalleryOpen(false);
      return;
    }
    if (activePhotoIndex === null || activePhotoIndex >= viewPhotos.length) {
      setActivePhotoIndex(0);
    }
  }, [viewPhotos, isGalleryOpen, activePhotoIndex]);

  const currentValidationState = (overrides = {}) => ({
    title: overrides.title ?? localTitle,
    lat: overrides.lat ?? localLat,
    lng: overrides.lng ?? localLng,
  });

  const applyValidation = (overrides = {}) => {
    setErrors(validate(currentValidationState(overrides)));
  };

  const onPickCoords = (lat, lng) => {
    const latStr = lat.toFixed(6);
    const lngStr = lng.toFixed(6);
    setLocalLat(latStr);
    setLocalLng(lngStr);
    applyValidation({ lat: latStr, lng: lngStr });
  };

  const handlePhotoUpload = async (event) => {
    const { files } = event.target;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploads = await Promise.all(Array.from(files).map((file) => fileToDataUrl(file)));
      setLocalPhotos((prev) => [...prev, ...uploads]);
    } catch (error) {
      console.error('Nepodařilo se načíst soubor:', error);
    } finally {
      event.target.value = '';
      setIsUploading(false);
    }
  };

  const handlePhotoCaptionChange = (id, caption) => {
    setLocalPhotos((prev) => prev.map((photo) => (photo.id === id ? { ...photo, caption } : photo)));
  };

  const handlePhotoRemove = (id) => {
    setLocalPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };

  const save = () => {
    const nextErrors = validate(currentValidationState());
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSave(card.id, (previous) => ({
      ...previous,
      title: localTitle,
      description: toArray(localDescription),
      notes: toArray(localNotes),
      tags: selectedTags,
      lat: localLat,
      lng: localLng,
      photos: normalisePhotos(localPhotos),
    }));
    setIsEditing(false);
  };

  const resetFromCard = () => {
    setLocalTitle(card.title);
    setLocalDescription(normaliseText(card.description));
    setLocalNotes(normaliseText(card.notes));
    setSelectedTags(
      (card.tags || [])
        .map((tag) => resolveTagKey(tag))
        .filter(Boolean)
    );
    setLocalLat(card.lat !== undefined && card.lat !== null ? String(card.lat) : '');
    setLocalLng(card.lng !== undefined && card.lng !== null ? String(card.lng) : '');
    setLocalPhotos(normalisePhotos(card.photos));
    setErrors({});
  };

  const cancel = () => {
    resetFromCard();
    setIsEditing(false);
  };

  const startEditing = () => {
    resetFromCard();
    setIsEditing(true);
  };

  const showPrevPhoto = useCallback(() => {
    if (viewPhotos.length < 2) return;
    setActivePhotoIndex((prev) => (prev === 0 ? viewPhotos.length - 1 : prev - 1));
  }, [viewPhotos.length]);

  const showNextPhoto = useCallback(() => {
    if (viewPhotos.length < 2) return;
    setActivePhotoIndex((prev) => (prev + 1) % viewPhotos.length);
  }, [viewPhotos.length]);

  useEffect(() => {
    if (!isGalleryOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsGalleryOpen(false);
      } else if (event.key === 'ArrowLeft') {
        showPrevPhoto();
      } else if (event.key === 'ArrowRight') {
        showNextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleryOpen, showPrevPhoto, showNextPhoto]);

  return (
    <div className="opened-card">
      {!isEditing ? (
        <>
          <h1 className="title ">{card.title}</h1>

          {(card.lat !== undefined && card.lat !== null) || (card.lng !== undefined && card.lng !== null) ? (
            <div className="location">
              <p className="paragraph">
                Souřadnice:
                <span className="location__value" title={card.lat != null ? String(card.lat) : undefined}>
                  {formatCoordinate(card.lat)}
                </span>
                ,
                <span className="location__value" title={card.lng != null ? String(card.lng) : undefined}>
                  {formatCoordinate(card.lng)}
                </span>
              </p>
            </div>
          ) : null}

          <div className="tags">
            {(card.tags || []).map((rawTag, index) => {
              const keyName = resolveTagKey(rawTag);
              if (keyName) {
                return <TagBadge key={`${keyName}-${index}`} keyName={keyName} />;
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
            {(Array.isArray(card.description) ? card.description : [card.description])
              .filter(Boolean)
              .map((oneParagraph, index) => (
                <p key={index} className="paragraph">
                  {oneParagraph}
                </p>
              ))}
          </div>

          <div className="notes">
            {(Array.isArray(card.notes) ? card.notes : [card.notes])
              .filter(Boolean)
              .map((oneParagraph, index) => (
                <p key={index} className="paragraph">
                  {oneParagraph}
                </p>
              ))}
          </div>

          {viewPhotos.length > 0 && (
            <div className="gallery">
              <div className="gallery__thumbnails">
                {viewPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    type="button"
                    className={`gallery__thumbnail ${index === activePhotoIndex ? 'is-active' : ''}`}
                    onClick={() => {
                      setActivePhotoIndex(index);
                      setIsGalleryOpen(true);
                    }}
                  >
                    <img src={photo.src} alt={photo.caption || photo.name} />
                  </button>
                ))}
              </div>
            </div>
          )}
          {isGalleryOpen && activePhotoIndex !== null && viewPhotos[activePhotoIndex] && (
            <div className="gallery-modal">
              <button
                type="button"
                className="gallery-modal__backdrop"
                onClick={() => setIsGalleryOpen(false)}
                aria-label="Zavřít galerii"
              />
              <div className="gallery-modal__content">
                <button
                  type="button"
                  className="gallery-modal__close"
                  onClick={() => setIsGalleryOpen(false)}
                  aria-label="Zavřít galerii"
                >
                  ×
                </button>
                <div className="gallery__main">
                  {viewPhotos.length > 1 && (
                    <button
                      type="button"
                      className="gallery__nav gallery__nav--prev"
                      onClick={(event) => {
                        event.stopPropagation();
                        showPrevPhoto();
                      }}
                      aria-label="Předchozí fotografie"
                    >
                      ◀
                    </button>
                  )}
                  <img
                    src={viewPhotos[activePhotoIndex].src}
                    alt={viewPhotos[activePhotoIndex].caption || viewPhotos[activePhotoIndex].name}
                    className="gallery__main-image"
                  />
                  {viewPhotos.length > 1 && (
                    <button
                      type="button"
                      className="gallery__nav gallery__nav--next"
                      onClick={(event) => {
                        event.stopPropagation();
                        showNextPhoto();
                      }}
                      aria-label="Následující fotografie"
                    >
                      ▶
                    </button>
                  )}
                </div>
                {viewPhotos[activePhotoIndex].caption && (
                  <p className="gallery__caption">{viewPhotos[activePhotoIndex].caption}</p>
                )}
              </div>
            </div>
          )}

          <div className="card__actions">
            <Link to="/" className="btn btn--primary btn--opened-card">Zpět</Link>
            <button className="btn btn--secondary" onClick={startEditing}>
              Upravit
            </button>
          </div>
        </>
      ) : (
        <>
          <label className="field-label">Název:</label>
          <input
            className="field-input"
            type="text"
            value={localTitle}
            onChange={(e) => {
              const nextValue = e.target.value;
              setLocalTitle(nextValue);
              applyValidation({ title: nextValue });
            }}
          />
          {errors.title && <span className="error-message">{errors.title}</span>}

          <div className="coords">
            <label className="field-label" htmlFor="detail-lat">
              Zeměpisná šířka <span className="required-star">*</span>
              {errors.lat && <span className="error-message">{errors.lat}</span>}
            </label>
            <input
              id="detail-lat"
              className="field-input"
              type="number"
              step="any"
              value={localLat}
              onChange={(e) => {
                const nextValue = e.target.value;
                setLocalLat(nextValue);
                applyValidation({ lat: nextValue });
              }}
            />

            <label className="field-label" htmlFor="detail-lng">
              Zeměpisná délka <span className="required-star">*</span>
              {errors.lng && <span className="error-message">{errors.lng}</span>}
            </label>
            <input
              id="detail-lng"
              className="field-input"
              type="number"
              step="any"
              value={localLng}
              onChange={(e) => {
                const nextValue = e.target.value;
                setLocalLng(nextValue);
                applyValidation({ lng: nextValue });
              }}
            />
          </div>

          <EditableLocationMap lat={localLat} lng={localLng} onPick={onPickCoords} />

          <p className="help-text">
            Náhled zobrazení: {formatCoordinate(localLat)} , {formatCoordinate(localLng)}
          </p>

          <div className="tags">
            {tagOptions.map((tag) => (
              <div key={tag.key} className="check-item">
                <label htmlFor={`tag-${tag.key}`} className="field-label">
                  <TagBadge keyName={tag.key} />
                </label>
                <input
                  id={`tag-${tag.key}`}
                  className="field-input"
                  type="checkbox"
                  name={tag.key}
                  checked={selectedTags.includes(tag.key)}
                  value={tag.key}
                  onChange={(e) => {
                    const { name, checked } = e.target;
                    setSelectedTags((prev) => {
                      if (checked) {
                        const next = [...prev, name];
                        return Array.from(new Set(next));
                      }
                      return prev.filter((t) => t !== name);
                    });
                  }}
                />
              </div>
            ))}
          </div>

          <label className="field-label">Popis:</label>
          <textarea
            className="notes"
            rows="8"
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
          />

          <label className="field-label">Poznámky:</label>
          <textarea
            className="notes"
            rows="8"
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
          />

          <div className="form__section">
            <h3 className="form__section-title">Fotogalerie</h3>
            <p className="help-text">Nahrajte nové fotografie nebo upravte popisky.</p>
            <input
              id="detail-photo-upload"
              className="field-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
            />
            {isUploading && <p className="help-text">Načítám náhledy...</p>}
            {localPhotos.length > 0 && (
              <div className="photo-list">
                {localPhotos.map((photo) => (
                  <div key={photo.id} className="photo-item">
                    <img src={photo.src} alt={photo.name} className="photo-item__preview" />
                    <input
                      type="text"
                      className="field-input"
                      placeholder="Popisek fotografie"
                      value={photo.caption}
                      onChange={(e) => handlePhotoCaptionChange(photo.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn--secondary btn--small"
                      onClick={() => handlePhotoRemove(photo.id)}
                    >
                      Odebrat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card__actions">
            <button className="btn btn--primary btn--large" onClick={save}>
              Uložit změny
            </button>
            <button className="btn btn--secondary" onClick={cancel}>
              Zrušit
            </button>
          </div>
        </>
      )}
    </div>
  );
};

CardOpenContent.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    notes: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
    tags: PropTypes.arrayOf(PropTypes.string),
    lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    lng: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    photos: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        src: PropTypes.string.isRequired,
        caption: PropTypes.string,
        name: PropTypes.string,
      })
    ),
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

const CardOpen = () => {
  const { tripId } = useParams();
  const { cards, updateCard } = useCards();
  const card = useMemo(
    () => cards.find((oneCard) => String(oneCard.id) === tripId),
    [cards, tripId],
  );

  if (!card) {
    return <div>Sorry, the requested card was not found.</div>;
  }

  return <CardOpenContent card={card} onSave={updateCard} />;
};

export default CardOpen;
