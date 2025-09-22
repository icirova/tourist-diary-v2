import PropTypes from 'prop-types';
import "./CardOpen.scss";
import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from "../data";
import TagBadge from './TagBadge';
import { TAGS, KEY_BY_ICON, TAG_BY_KEY } from '../tags';
import CustomMapPin from './CustomMapPin';

const DEFAULT_CENTER = [49.7514919, 15.326442];

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

const CardOpenContent = ({ card }) => {
  const tagOptions = useMemo(() => TAGS, []);
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(card.title);
  const [localDescription, setLocalDescription] = useState(normaliseText(card.description));
  const [localNotes, setLocalNotes] = useState(normaliseText(card.notes));
  const [selectedTags, setSelectedTags] = useState(
    (card.tags || [])
      .map((icon) => KEY_BY_ICON[icon])
      .filter(Boolean)
  );
  const [localLat, setLocalLat] = useState(
    card.lat !== undefined && card.lat !== null ? String(card.lat) : ''
  );
  const [localLng, setLocalLng] = useState(
    card.lng !== undefined && card.lng !== null ? String(card.lng) : ''
  );
  const [errors, setErrors] = useState({});

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

  const save = () => {
    const nextErrors = validate(currentValidationState());
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    card.title = localTitle;
    card.description = toArray(localDescription);
    card.notes = toArray(localNotes);
    card.tags = selectedTags
      .map((key) => (TAG_BY_KEY[key] ? TAG_BY_KEY[key].icon : undefined))
      .filter(Boolean);
    card.lat = parseFloat(localLat);
    card.lng = parseFloat(localLng);
    setIsEditing(false);
  };

  const cancel = () => {
    setLocalTitle(card.title);
    setLocalDescription(normaliseText(card.description));
    setLocalNotes(normaliseText(card.notes));
    setSelectedTags(
      (card.tags || [])
        .map((icon) => KEY_BY_ICON[icon])
        .filter(Boolean)
    );
    setLocalLat(card.lat !== undefined && card.lat !== null ? String(card.lat) : '');
    setLocalLng(card.lng !== undefined && card.lng !== null ? String(card.lng) : '');
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="opened-card">
      {!isEditing ? (
        <>
          <h1 className="title ">{card.title}</h1>

          <div className="tags">
            {(card.tags || []).map((icon, index) => {
              const keyName = KEY_BY_ICON[icon];
              return <TagBadge key={`${keyName || icon}-${index}`} keyName={keyName || ''} />;
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

          <div className="location">
            <p className="paragraph">Souřadnice: {card.lat}, {card.lng}</p>
          </div>

          <div className="card__actions">
            <Link to="/" className="btn btn--primary btn--opened-card">Zpět</Link>
            <button className="btn btn--secondary" onClick={() => setIsEditing(true)}>
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
                    setSelectedTags((prev) =>
                      checked ? [...prev, name] : prev.filter((t) => t !== name)
                    );
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
  }).isRequired,
};

const CardOpen = () => {
  const { tripId } = useParams();
  const card = data.find((oneCard) => oneCard.id === parseInt(tripId, 10));

  if (!card) {
    return <div>Sorry, the requested card was not found.</div>;
  }

  return <CardOpenContent card={card} />;
};

export default CardOpen;
