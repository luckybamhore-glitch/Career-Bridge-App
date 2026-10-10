import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAuthStatus from '../hooks/useAuthStatus';
import useOnlineUsers from '../hooks/useOnlineUsers';
import useCreditSync from '../hooks/useCreditSync';
import { disconnectSocket } from '../lib/socket';
import LoadingScreen from './LoadingScreen';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateComponent = () => {
  const { user } = useSelector((state) => state.auth);
  const { checkingUser, isAuthenticated } = useAuthStatus();

  // Maintain global realtime online presence socket whenever user is logged in
  useOnlineUsers(user?.token);
  // Realtime wallet: admin grants + roadmap deducts update credits instantly
  useCreditSync(user?.token);

  // Safety: drop the shared socket on logout (Navbar also does this)
  useEffect(() => {
    if (!user?.token) disconnectSocket();
  }, [user?.token]);

  if (checkingUser) {
    return <LoadingScreen />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} />;
};

export default PrivateComponent;