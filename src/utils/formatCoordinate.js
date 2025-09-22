const formatCoordinate = (value, options = {}) => {
  const { fallback = '—', digits = 3 } = options;
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }

  return numeric.toFixed(digits);
};

export default formatCoordinate;
