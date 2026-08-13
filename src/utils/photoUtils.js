export const generatePhotoId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const MAX_PHOTOS_PER_TRIP = 3;
export const MAX_PHOTO_BYTES = 750 * 1024;
const MAX_DIMENSION = 1600;

const canvasToBlob = (canvas, type, quality) => new Promise((resolve) => {
  canvas.toBlob(resolve, type, quality);
});

export const optimisePhoto = async (file) => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Podporované jsou pouze obrázky JPEG, PNG a WebP.');
  }
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let blob;
  for (const quality of [0.82, 0.7, 0.58, 0.46]) {
    blob = await canvasToBlob(canvas, 'image/webp', quality);
    if (blob && blob.size <= MAX_PHOTO_BYTES) break;
  }
  if (!blob || blob.size > MAX_PHOTO_BYTES) {
    throw new Error('Fotografii se nepodařilo zmenšit pod 750 kB.');
  }
  return {
    id: generatePhotoId(),
    src: URL.createObjectURL(blob),
    file: blob,
    name: file.name,
    caption: '',
  };
};

export const fileToDataUrl = optimisePhoto;
