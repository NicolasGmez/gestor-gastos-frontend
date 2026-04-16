import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import PageTransition from './components/PageTransition'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Categories from './pages/Categories'
import Stats from './pages/Stats'
import Budgets from './pages/Budgets'
import SavingsGoals from './pages/SavingsGoals'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><PageTransition><Transactions /></PageTransition></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><PageTransition><Categories /></PageTransition></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><PageTransition><Budgets /></PageTransition></ProtectedRoute>} />
        <Route path="/savings" element={<ProtectedRoute><PageTransition><SavingsGoals /></PageTransition></ProtectedRoute>} />
        <Route path="/stats" element={<ProtectedRoute><PageTransition><Stats /></PageTransition></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <AnimatedRoutes />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App