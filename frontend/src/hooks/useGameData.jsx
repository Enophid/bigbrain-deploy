import { useState, useEffect } from 'react';
import ApiCall from '../components/apiCall';

const useGameData = (gameId) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allGames, setAllGames] = useState([]); // Store all games

  // Fetch game data
  const fetchGameData = async () => {
    try {
      setLoading(true);
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

      // Ensure all questions have unique IDs by transforming the data
      if (gameData.questions && gameData.questions.length > 0) {
        gameData.questions = gameData.questions.map((question, index) => {
          // If a question lacks an ID, assign a unique timestamp-based one
          if (!question.id) {
            return { ...question, id: Date.now() + index };
          }
          return question;
        });
      }

      setGame(gameData);
      setLoading(false);
      return gameData;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  // Update game data
  const updateGame = async (updatedGame) => {
    try {
      // Create a new array with all games, replacing the updated one
      const updatedGames = allGames.map(g => 
        g.id === updatedGame.id ? updatedGame : g
      );
      
      console.log('Updating all games:', updatedGames);
      
      // Update the games using the bulk update endpoint
      const response = await ApiCall(
        '/admin/games',
        { games: updatedGames },
        'PUT'
      );

      if (response.error) {
        throw new Error(response.error);
      }

      // Fetch the updated game data
      await fetchGameData();
      return true;
    } catch (err) {
      console.error('Failed to update game:', err.message);
      setError(err.message);
      return false;
    }
  };

  // Fetch game data on component mount
  useEffect(() => {
    fetchGameData();
  }, [gameId]);

  return { game, loading, error, updateGame, fetchGameData };
};

export default useGameData; 