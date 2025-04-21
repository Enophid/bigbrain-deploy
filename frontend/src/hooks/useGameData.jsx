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
          const questionWithId = !question.id 
            ? { ...question, id: Date.now() + index } 
            : question;
          
          // Make sure all required fields are present with proper format
          // This handles both API responses and imported JSON structures
          return {
            ...questionWithId,
            // Ensure these fields have proper defaults if missing
            id: questionWithId.id,
            text: questionWithId.text || '',
            type: questionWithId.type || 'single',
            timeLimit: questionWithId.timeLimit || questionWithId.duration || 30,
            points: questionWithId.points || 10,
            // Map answers to the expected format
            answers: Array.isArray(questionWithId.answers) 
              ? questionWithId.answers.map((answer, idx) => ({
                id: Date.now() + index + idx, // Ensure unique IDs
                text: answer.text || '',
                isCorrect: answer.isCorrect === true
              }))
              : [{ id: Date.now() + index, text: '', isCorrect: true }],
            // Ensure correctAnswers exists (needed for editing)
            correctAnswers: Array.isArray(questionWithId.correctAnswers) 
              ? questionWithId.correctAnswers 
              : questionWithId.answers 
                ? questionWithId.answers
                  .filter(ans => ans.isCorrect === true)
                  .map(ans => ans.text)
                : [],
            // Include media URLs if present
            imageUrl: questionWithId.imageUrl || '',
            videoUrl: questionWithId.videoUrl || '',
          };
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