/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { createContext, useContext, useMemo, useState } from 'react';
import initialData from '../data';
import { TAGS } from '../tags';

const CardsContext = createContext(null);

const TAG_BY_KEY = Object.fromEntries(TAGS.map((tag) => [tag.key, tag.icon]));

const normalizeTextField = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }
  return [];
};

const normalizePhotos = (photos) => {
  if (!Array.isArray(photos)) return [];
  return photos
    .filter((photo) => photo && photo.src)
    .map((photo) => ({
      id: photo.id || `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      src: photo.src,
      caption: photo.caption || '',
      name: photo.name || '',
    }));
};

const mapTagsToIcons = (keys = []) =>
  keys
    .map((key) => TAG_BY_KEY[key])
    .filter(Boolean);

const normalizeFormInput = (raw, fallbackId) => ({
  id: raw.id ?? fallbackId,
  title: raw.title,
  lat: raw.lat !== undefined && raw.lat !== null ? parseFloat(raw.lat) : undefined,
  lng: raw.lng !== undefined && raw.lng !== null ? parseFloat(raw.lng) : undefined,
  tags: mapTagsToIcons(raw.tags || []),
  description: normalizeTextField(raw.description),
  notes: normalizeTextField(raw.notes),
  photos: normalizePhotos(raw.photos),
});

export const CardsProvider = ({ children }) => {
  const [cards, setCards] = useState(initialData);

  const addCard = (payload) => {
    setCards((prevCards) => {
      const currentIds = prevCards.map((card) => card.id);
      const nextId = currentIds.length ? Math.max(...currentIds) + 1 : 1;
      const normalized = normalizeFormInput(payload, nextId);
      return [normalized, ...prevCards];
    });
  };

  const updateCard = (id, updater) => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== id) return card;
        const draft = typeof updater === 'function' ? updater(card) : { ...card, ...updater };
        return {
          ...card,
          ...draft,
          tags: draft.tags ?? card.tags,
          lat:
            draft.lat !== undefined && draft.lat !== null
              ? parseFloat(draft.lat)
              : card.lat,
          lng:
            draft.lng !== undefined && draft.lng !== null
              ? parseFloat(draft.lng)
              : card.lng,
          description: normalizeTextField(draft.description ?? card.description),
          notes: normalizeTextField(draft.notes ?? card.notes),
          photos: normalizePhotos(draft.photos ?? card.photos),
        };
      }),
    );
  };

  const locations = useMemo(
    () =>
      cards
        .filter((card) =>
          typeof card.lat === 'number' && !Number.isNaN(card.lat) &&
          typeof card.lng === 'number' && !Number.isNaN(card.lng)
        )
        .map((card) => ({
          id: card.id,
          title: card.title,
          lat: card.lat,
          lng: card.lng,
          description: card.description,
        })),
    [cards],
  );

  const value = useMemo(
    () => ({ cards, addCard, updateCard, locations }),
    [cards, locations],
  );

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
};

CardsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCards = () => {
  const ctx = useContext(CardsContext);
  if (!ctx) {
    throw new Error('useCards must be used within CardsProvider');
  }
  return ctx;
};

export default CardsContext;
