// Auth error handler
let authErrorHandler = null;

// Function to set the auth error handler from outside
export const setAuthErrorHandler = (handler) => {
  authErrorHandler = handler;
};

// Function to call the auth error handler
export const handleAuthError = () => {
  if (authErrorHandler) {
    authErrorHandler();
  }
}; 