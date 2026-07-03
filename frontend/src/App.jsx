import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Dashboard from './pages/Dashboard'
import InterviewSetup from './pages/InterviewSetup'
import InterviewRoom from './pages/InterviewRoom'
import Result from './pages/Result'
import useAuthStore from './store/authStore'

function PrivateRoute({ children }) {
  const { user } = useAuthStore()
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/setup" element={<PrivateRoute><InterviewSetup /></PrivateRoute>} />
        <Route path="/interview/:sessionId" element={<PrivateRoute><InterviewRoom /></PrivateRoute>} />
        <Route path="/result/:sessionId" element={<PrivateRoute><Result /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  )
}