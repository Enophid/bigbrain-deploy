import { useState } from 'react';


const useAlert = () => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('info');

  // Display an alert message
  const displayAlert = (message, severity = 'info') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
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
    alertSeverity,
    displayAlert,
  };
};

export default useAlert; 