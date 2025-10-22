import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function PrivateRoute({ children }) {
  const { user } = useContext(AppContext);
  return user ? children : <Navigate to="/login" />;
}
