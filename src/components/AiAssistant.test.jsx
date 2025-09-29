import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AiAssistant from './AiAssistant';
import { CardsProvider } from '../context/CardsContext';
import { AiAssistantProvider } from '../context/AiAssistantContext';

const renderAssistant = () =>
  render(
    <MemoryRouter>
      <CardsProvider>
        <AiAssistantProvider>
          <AiAssistant />
        </AiAssistantProvider>
      </CardsProvider>
    </MemoryRouter>,
  );

describe('AiAssistant component', () => {
  it('shows hint and then displays recommendations after submitting a query', async () => {
    renderAssistant();

    expect(
      screen.getByText(/doporučení se zobrazí zde/i),
    ).toBeInTheDocument();

    const textarea = screen.getByLabelText(/zadání/i);
    fireEvent.change(textarea, { target: { value: 'family cafe' } });

    fireEvent.click(screen.getByRole('button', { name: /najít výlety/i }));

    await waitFor(() =>
      expect(
        screen.getByText(/Našla jsem výlety, které se nejlépe shodují/i),
      ).toBeInTheDocument(),
    );

    expect(screen.getAllByRole('link', { name: /detail/i }).length).toBeGreaterThan(0);
  });
});
