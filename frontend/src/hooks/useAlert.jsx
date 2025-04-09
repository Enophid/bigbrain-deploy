import { useState } from 'react';


const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // Display an alert message
  const displayAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage(null);
    }, 5000);
  };

  return {
    alertMessage,
    showAlert,
    displayAlert,
  };
};

export default useAlert; 