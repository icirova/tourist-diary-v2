import { apiRequest } from './apiClient';

const serializeTrip = (payload) => ({
  title: payload.title.trim(), lat: Number(payload.lat), lng: Number(payload.lng),
  tags: payload.tags || [], description: payload.description || [], notes: payload.notes || [],
  photos: (payload.photos || []).filter((photo) => !photo.file).map(({ id, caption, position }) => ({ id, caption, position })),
});

const uploadPhotos = async (tripId, photos) => {
  const fresh = photos.filter((photo) => photo.file instanceof Blob);
  if (!fresh.length) return;
  const form = new FormData();
  fresh.forEach((photo) => {
    form.append('photos', photo.file, photo.name || 'photo.webp');
    form.append('captions', photo.caption || '');
  });
  await apiRequest(`/trips/${tripId}/photos`, { method: 'POST', body: form });
};

export const tripsRepository = {
  list: () => apiRequest('/trips'),
  async create(_userId, payload) {
    const trip = await apiRequest('/trips', { method: 'POST', body: JSON.stringify(serializeTrip(payload)) });
    try { await uploadPhotos(trip.id, payload.photos || []); }
    catch (error) { await apiRequest(`/trips/${trip.id}`, { method: 'DELETE' }); throw error; }
    return apiRequest(`/trips/${trip.id}`);
  },
  async update(_userId, tripId, payload) {
    await apiRequest(`/trips/${tripId}`, { method: 'PUT', body: JSON.stringify(serializeTrip(payload)) });
    await uploadPhotos(tripId, payload.photos || []);
    return apiRequest(`/trips/${tripId}`);
  },
  delete: (tripId) => apiRequest(`/trips/${tripId}`, { method: 'DELETE' }),
};

