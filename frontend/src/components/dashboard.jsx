import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiCall from './apiCall';
import FileToDataUrl from '../helper/helpers';
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Container,
  Typography,
  Grid,
} from '@mui/material';
import bigBrainTheme from '../theme/bigBrainTheme';
import GlobalStyles from '../theme/globalStyles';

// Component imports
import Header from './dashboard/Header';
import GameCard from './dashboard/GameCard';
import CreateGameModal from './dashboard/CreateGameModal';
import EmptyState from './dashboard/EmptyState';
import SessionModal from './dashboard/SessionModal';

// Helper function
const generateRandomID = () => Math.floor(Math.random() * 10 ** 8);

function Dashboard() {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('No file chosen');
  const hasFetched = useRef(false);
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [currentSession, setCurrentSession] = useState({ 
    id: null, 
    gameName: '',
    isNewSession: true,
    gameId: null
  });
  const [newGameDetails, setNewGameDetails] = useState({
    id: 0,
    owner: '',
    questions: [],
    active: null,
    createAt: '',
    name: '',
    thumbnail: '',
  });

  // Load games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await ApiCall('/admin/games', {}, 'GET');
        if (data.error) {
          throw new Error(data.error);
        }
        setGames(data.games);
      } catch (err) {
        console.error('Failed to fetch games:', err.message);
      }
    };

    if (!hasFetched.current) {
      fetchGames();
      hasFetched.current = true;
    }
  }, []);

  // Modal handlers
  const handleCloseModal = () => setModalOpen(false);
  const handleOpenModal = () => setModalOpen(true);

  // File handlers
  const handleFileChange = async (event) => {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      setFileName(file.name);
      try {
        const dataUrl = await FileToDataUrl(file);
        setNewGameDetails({
          ...newGameDetails,
          thumbnail: dataUrl,
        });
      } catch (err) {
        console.error('Failed to convert file to data URL:', err);
      }
    }
  };

  // Input handlers
  const handleInputChange = (e) => {
    setNewGameDetails({
      ...newGameDetails,
      [e.target.name]: e.target.value,
    });
  };

  // New game handler
  const handleAddNewGame = async () => {
    try {
      // Get the current user's email from localStorage
      const userEmail = localStorage.getItem('admin');
      
      if (!userEmail) {
        throw new Error("User not authenticated. Please log in again.");
      }
      
      const gameId = generateRandomID();
      const newGame = {
        ...newGameDetails,
        id: gameId,
        owner: userEmail, // Set the owner to the current user's email
        questions: [],
        active: null,
        createAt: new Date().toISOString(),
      };

      // Update local state
      const updatedGames = [...games, newGame];
      
      // Reset form and close modal
      setNewGameDetails({
        id: 0,
        owner: '',
        questions: [],
        active: null,
        createAt: '',
        name: '',
        thumbnail: '',
      });
      setFileName('No file chosen');
      setModalOpen(false);
      
      // Save to backend
      const response = await ApiCall('/admin/games', { games: updatedGames }, 'PUT');
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Re-fetch the games to ensure we have the latest state from the server
      const refreshData = await ApiCall('/admin/games', {}, 'GET');
      if (refreshData.error) {
        throw new Error(refreshData.error);
      }
      
      setGames(refreshData.games);
      console.log('New game created successfully');
    } catch (err) {
      console.error('Failed to save game:', err.message);
      // Revert local state if backend failed - but still fetch fresh data
      try {
        const refreshData = await ApiCall('/admin/games', {}, 'GET');
        if (!refreshData.error) {
          setGames(refreshData.games);
        }
      } catch (refreshErr) {
        console.error('Failed to refresh game data:', refreshErr.message);
      }
    }
  };

  // Game management handlers
  const handleEditGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  
}

export default Dashboard;
