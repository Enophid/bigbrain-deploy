import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import ApiCall from '../../apiCall';

export default function useLogout() {
  const { logout } = useAuth();
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
      const token = localStorage.getItem('token');
      const data = await ApiCall(
        '/admin/auth/logout',
        { token },
        'POST'
      );
      if (data.error) {
        throw new Error(data.error || 'Logout failed');
      } else {
        logout();
        setIsLoggingOut(false);
        setOpen(false);
      }
    } catch (error) {
      console.error('Logout failed:', error);
      logout();
    }
  };

  return {
    open,
    isLoggingOut,
    handleOpenDialog,
    handleCloseDialog,
    handleLogout,
  };
}
