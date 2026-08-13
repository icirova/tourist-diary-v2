/* eslint-disable react-refresh/only-export-components */
import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import initialData from '../data';
import { normalizeTagList } from '../tags';
import { toParagraphArray } from '../utils/text';
import { tripsRepository } from '../data/tripsRepository';
import { useAuth } from './AuthContext';

const CardsContext = createContext(null);
const normalizePhotos = (photos) => Array.isArray(photos) ? photos.filter((photo) => photo?.src).map((photo) => ({
  ...photo, id: photo.id || `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`, caption: photo.caption || '', name: photo.name || '',
})) : [];
const normalizeCard = (raw) => ({
  ...raw,
  lat: raw.lat !== undefined && raw.lat !== null ? Number(raw.lat) : undefined,
  lng: raw.lng !== undefined && raw.lng !== null ? Number(raw.lng) : undefined,
  tags: normalizeTagList(raw.tags || []),
  description: toParagraphArray(raw.description), notes: toParagraphArray(raw.notes), photos: normalizePhotos(raw.photos),
});

export const CardsProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [cards, setCards] = useState(() => initialData.map(normalizeCard));
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    if (!isAuthenticated) {
      setCards(initialData.map(normalizeCard)); setError(null); return;
    }
    setIsLoading(true); setError(null);
    try { setCards((await tripsRepository.list()).map(normalizeCard)); }
    catch (loadError) { setError(loadError.message); setCards([]); }
    finally { setIsLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { if (!isAuthLoading) reload(); }, [isAuthLoading, reload, user?.id]);

  const addCard = async (payload) => {
    if (!user) throw new Error('Pro přidání výletu se přihlaste.');
    setIsSaving(true); setError(null);
    try {
      const created = normalizeCard(await tripsRepository.create(user.id, normalizeCard(payload)));
      setCards((previous) => [created, ...previous]); return created;
    } catch (saveError) { setError(saveError.message); throw saveError; }
    finally { setIsSaving(false); }
  };

  const updateCard = async (id, updater) => {
    if (!user) throw new Error('Pro úpravu výletu se přihlaste.');
    const current = cards.find((card) => card.id === id);
    if (!current) throw new Error('Výlet nebyl nalezen.');
    const draft = typeof updater === 'function' ? updater(current) : { ...current, ...updater };
    setIsSaving(true); setError(null);
    try {
      const updated = normalizeCard(await tripsRepository.update(user.id, id, normalizeCard(draft)));
      setCards((previous) => previous.map((card) => card.id === id ? updated : card)); return updated;
    } catch (saveError) { setError(saveError.message); throw saveError; }
    finally { setIsSaving(false); }
  };

  const deleteCard = async (id) => {
    if (!user) throw new Error('Pro odstranění výletu se přihlaste.');
    setIsSaving(true);
    try { await tripsRepository.delete(id); setCards((previous) => previous.filter((card) => card.id !== id)); }
    finally { setIsSaving(false); }
  };

  const locations = useMemo(() => cards.filter((card) => Number.isFinite(card.lat) && Number.isFinite(card.lng)).map((card) => ({
    id: card.id, title: card.title, lat: card.lat, lng: card.lng, description: card.description,
  })), [cards]);
  const value = { cards, addCard, updateCard, deleteCard, locations, isLoading, isSaving, error, reload };
  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
};
CardsProvider.propTypes = { children: PropTypes.node.isRequired };
export const useCards = () => {
  const context = useContext(CardsContext);
  if (!context) throw new Error('useCards must be used within CardsProvider');
  return context;
};
