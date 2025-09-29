import { describe, expect, it } from 'vitest';
import { mockRecommendTrips } from './aiAssistant';

const sampleCards = [
  {
    id: 1,
    title: 'Lesní muzeum',
    description: ['Vhodné pro rodiny a milovníky přírody.'],
    notes: ['Občerstvení v kiosku.'],
    tags: ['family', 'cafe'],
  },
  {
    id: 2,
    title: 'Stezka odvahy',
    description: ['Adrenalinový park.'],
    notes: [],
    tags: ['tent'],
  },
];

describe('mockRecommendTrips', () => {
  it('returns matching card ids when tokens overlap', async () => {
    const response = await mockRecommendTrips('family cafe', sampleCards, { artificialDelay: 0 });
    expect(response.recommendations).toEqual([1]);
    expect(response.reasoning).toBeTypeOf('string');
  });

  it('handles empty input by returning no recommendations', async () => {
    const response = await mockRecommendTrips('   ', sampleCards, { artificialDelay: 0 });
    expect(response.recommendations).toEqual([]);
    expect(response.reasoning).toContain('Zadejte');
  });
});
