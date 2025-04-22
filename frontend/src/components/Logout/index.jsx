import LogoutButton from './components/LogoutButton';
import LogoutDialog from './components/LogoutDialog';
import useLogout from './components/useLogout.jsx';

export default function Logout() {
  const {
    open,
    isLoggingOut,
    handleOpenDialog,
    handleCloseDialog,
    handleLogout,
  } = useLogout();

  return (
    <>
      <LogoutButton onLogout={handleOpenDialog} />
      <LogoutDialog
        open={open}
        isLoggingOut={isLoggingOut}
        onClose={handleCloseDialog}
        onConfirm={handleLogout}
      />
    </>
  );
}
