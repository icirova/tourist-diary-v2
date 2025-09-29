import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useCards } from './CardsContext';
import { mockRecommendTrips } from '../utils/aiAssistant';

const AiAssistantContext = createContext(null);

export const AiAssistantProvider = ({ children }) => {
  const { cards } = useCards();
  const [status, setStatus] = useState('idle');
  const [history, setHistory] = useState([]);
  const [lastAnswer, setLastAnswer] = useState(null);
  const [error, setError] = useState(null);

  const askAssistant = useCallback(
    async (prompt) => {
      const trimmedPrompt = prompt?.trim();
      if (!trimmedPrompt) {
        setError('Nejdřív popište, co hledáte.');
        return null;
      }

      setStatus('loading');
      setError(null);

      try {
        const response = await mockRecommendTrips(trimmedPrompt, cards);
        const entry = {
          id: Date.now(),
          query: trimmedPrompt,
          recommendations: response.recommendations,
          reasoning: response.reasoning,
        };
        setHistory((prev) => [entry, ...prev]);
        setLastAnswer(entry);
        setStatus('resolved');
        return entry;
      } catch (err) {
        console.error('AI assistant failed:', err);
        setStatus('error');
        setError('Omlouvám se, ale doporučení se nepodařilo načíst. Zkuste to prosím znovu.');
        return null;
      }
    },
    [cards],
  );

  const resetAssistant = useCallback(() => {
    setHistory([]);
    setLastAnswer(null);
    setStatus('idle');
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      status,
      history,
      lastAnswer,
      error,
      askAssistant,
      resetAssistant,
    }),
    [status, history, lastAnswer, error, askAssistant, resetAssistant],
  );

  return <AiAssistantContext.Provider value={value}>{children}</AiAssistantContext.Provider>;
};

AiAssistantProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAiAssistant = () => {
  const ctx = useContext(AiAssistantContext);
  if (!ctx) {
    throw new Error('useAiAssistant must be used inside AiAssistantProvider');
  }
  return ctx;
};

export default AiAssistantContext;
