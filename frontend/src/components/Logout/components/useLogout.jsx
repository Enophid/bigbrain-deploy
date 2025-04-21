import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiCall from '../../apiCall';

export default function useLogout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const data = await ApiCall(
        '/admin/auth/logout',
        { token: localStorage.getItem('token') },
        'POST'
      );
      if (data.error) {
        throw new Error(data.error || 'Logout failed');
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        navigate('/login');
        setIsLoggingOut(false);
        setOpen(false);
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    open,
    isLoggingOut,
    handleOpenDialog,
    handleCloseDialog,
    handleLogout
  };
}