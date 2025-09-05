import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * A custom hook to provide easy access to the authentication context.
 * It ensures that the hook is used within a component tree wrapped by AuthProvider.
 *
 * @returns {object} The authentication context value, which includes the user,
 * loginAction, logOut, etc.
 */
const useAuth = () => {
  // 1. Consume the context
  const context = useContext(AuthContext);

  // 2. Add a check to ensure it's used within the AuthProvider tree
  // This provides a clear error message to developers if they forget to wrap a component.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // 3. Return the context value
  return context;
};

export default useAuth;