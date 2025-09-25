const toParagraphArray = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((paragraph) => (typeof paragraph === 'string' ? paragraph.trim() : ''))
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }
  return [];
};

const limitParagraphs = (value, limit) => {
  const paragraphs = toParagraphArray(value);
  if (typeof limit === 'number') {
    return paragraphs.slice(0, Math.max(0, limit));
  }
  return paragraphs;
};

const paragraphsToMultiline = (value) => {
  const paragraphs = toParagraphArray(value);
  return paragraphs.join('\n');
};

export { toParagraphArray, limitParagraphs, paragraphsToMultiline };
