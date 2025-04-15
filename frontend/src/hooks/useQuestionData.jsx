import { useState, useEffect } from 'react';
import ApiCall from '../components/apiCall';

const useQuestionData = (gameId, questionId) => {
  const [game, setGame] = useState(null);
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);
  const [allGames, setAllGames] = useState([]); // Store all games

  const getQuestionData = async () => {
    try {
      // Get all games instead of trying to fetch a specific one
      const data = await ApiCall('/admin/games', {}, 'GET');
      if (data.error) {
        throw new Error(data.error);
      }

      // Store all games
      setAllGames(data.games);

      // Find the specific game by ID
      const gameData = data.games.find((g) => g.id.toString() === gameId);
      if (!gameData) {
        throw new Error('Game not found');
      }
      const questionData = gameData.questions.find(
        (q) => q.id.toString() === questionId,
      );
      if (!questionData) {
        throw new Error('Question not found');
      }

      setGame(gameData);
      setQuestion(questionData);
      return gameData;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const updateQuestionData = async (updatedGame) => {
    try {
      // Create a new array with all games, replacing the updated one
      const updatedGames = allGames.map((g) =>
        g.id === updatedGame.id ? updatedGame : g,
      );

      console.log('Updating all games:', updatedGames);

      // Update the games using the bulk update endpoint
      const response = await ApiCall(
        '/admin/games',
        { games: updatedGames },
        'PUT',
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Fetch the updated game data
      await getQuestionData();
      return true;
    } catch (err) {
      console.error('Failed to update game:', err.message);
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    getQuestionData();
  }, [gameId]);

  return { game, question, error, updateQuestionData, getQuestionData };
};

export default useQuestionData;
