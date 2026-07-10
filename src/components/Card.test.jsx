import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Card from './Card';

describe('Card', () => {
  it('zobrazí titulek a odkaz na detail', () => {
    render(
      <MemoryRouter>
        <Card
          id="abc"
          title="První výlet"
          description={['Hezké místo u řeky.']}
          notes={['Poznámka']}
          tags={[]}
          photos={[]}
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /první výlet/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /detail/i })).toHaveAttribute(
      'href',
      '/detail/abc',
    );
  });

  it('nezobrazuje sekundární souřadnice v seznamu karet', () => {
    render(
      <MemoryRouter>
        <Card
          id="xyz"
          title="Výlet na rozhlednu"
          description={[]}
          notes={[]}
          tags={[]}
          photos={[]}
          lat={50.1234}
          lng={14.5678}
        />
      </MemoryRouter>,
    );

    expect(screen.queryByText(/souřadnice:/i)).not.toBeInTheDocument();
    expect(screen.queryByText('50.123')).not.toBeInTheDocument();
    expect(screen.queryByText('14.568')).not.toBeInTheDocument();
  });
});
