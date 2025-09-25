const parseNumber = (value) => {
  if (value === undefined || value === null || value === '') {
    return { hasValue: false };
  }

  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return { hasValue: true, isValid: false };
  }

  return { hasValue: true, isValid: true, value: numeric };
};

export const validateCardBasics = ({ title, lat, lng }) => {
  const errors = {};

  if (!title || title.trim() === '') {
    errors.title = 'Povinné pole.';
  }

  const latCheck = parseNumber(lat);
  if (!latCheck.hasValue || latCheck.isValid === false) {
    errors.lat = 'Povinné pole.';
  } else if (latCheck.value < -90 || latCheck.value > 90) {
    errors.lat = 'Mimo rozsah (−90 až 90).';
  }

  const lngCheck = parseNumber(lng);
  if (!lngCheck.hasValue || lngCheck.isValid === false) {
    errors.lng = 'Povinné pole.';
  } else if (lngCheck.value < -180 || lngCheck.value > 180) {
    errors.lng = 'Mimo rozsah (−180 až 180).';
  }

  return errors;
};

export const hasNoErrors = (errors) => Object.keys(errors || {}).length === 0;

