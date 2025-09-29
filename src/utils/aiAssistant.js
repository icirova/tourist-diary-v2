const normalizeText = (value) => {
  if (!value) return '';
  return String(value).toLowerCase();
};

const scoreCard = (card, queryTokens) => {
  const haystack = [
    card.title,
    ...(Array.isArray(card.description) ? card.description : []),
    ...(Array.isArray(card.notes) ? card.notes : []),
    ...(Array.isArray(card.tags) ? card.tags : []),
  ]
    .map(normalizeText)
    .join(' ');

  const matches = queryTokens.filter((token) => haystack.includes(token));
  const baseScore = matches.length * 3;
  const tagBonus = Array.isArray(card.tags)
    ? card.tags.filter((tag) => queryTokens.includes(normalizeText(tag))).length
    : 0;

  return baseScore + tagBonus;
};

export const mockRecommendTrips = async (query, cards, options = {}) => {
  const { limit = 3, artificialDelay = 600 } = options;
  const sanitizedQuery = normalizeText(query).trim();
  if (!sanitizedQuery) {
    return {
      recommendations: [],
      reasoning: 'Zadejte prosím, co vás zajímá – například typ výletu, aktivitu nebo oblast.',
    };
  }

  const tokens = sanitizedQuery
    .split(/[^a-z0-9áéíóúýčďěňřšťž]+/i)
    .map((token) => token.trim())
    .filter(Boolean);

  const scored = cards
    .map((card) => ({ card, score: scoreCard(card, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ card }) => card.id);

  const reasoning = scored.length
    ? 'Našla jsem výlety, které se nejlépe shodují s vaším zadáním.'
    : 'Nenašla jsem žádné výlety, které by odpovídaly zadání. Zkuste popsat hledané místo detailněji.';

  await new Promise((resolve) => setTimeout(resolve, artificialDelay));

  return {
    recommendations: scored,
    reasoning,
  };
};

export default mockRecommendTrips;
