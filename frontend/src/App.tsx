import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Landing from './pages/Landing'
import TryOn from './pages/TryOn'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Account from './pages/Account'
import AuthPage from './pages/AuthPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import { auth as fbAuth } from './firebase'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/app" element={<TryOn />} />
            <Route path="/account" element={<Protected><Account /></Protected>} />
            {/* Redirect old auth routes to new unified page */}
            <Route path="/signin" element={<Navigate to="/auth" replace />} />
            <Route path="/signup" element={<Navigate to="/auth" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6">Loading…</div>
  if (!user) {
    // Allow if Firebase session exists but context hasn't hydrated yet
    const hasFirebaseSession = !!fbAuth?.currentUser
    if (!hasFirebaseSession) return <Navigate to="/auth" replace />
  }
  return <>{children}</>
}

export default App
