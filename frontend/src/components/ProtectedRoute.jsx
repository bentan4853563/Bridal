import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  // If user tries to access root path when authenticated, redirect to home
  if (window.location.pathname === '/') {
    return <Navigate to="/home" replace />
  }

  return children
}

export default ProtectedRoute 