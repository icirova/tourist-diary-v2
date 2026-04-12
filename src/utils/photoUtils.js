export const generatePhotoId = () => {
  if (typeof window !== 'undefined' && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: generatePhotoId(),
        src: reader.result,
        name: file.name,
        caption: '',
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
