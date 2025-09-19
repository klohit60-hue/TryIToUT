import { Link, NavLink } from 'react-router-dom'
import { Info, HelpCircle, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-fuchsia-200/60 bg-white/75 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-sm font-semibold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent">
          TryItOut.Ai
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}>
            Home
          </NavLink>
          <NavLink to="/app" className={({ isActive }) => isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}>
            App
          </NavLink>
          <button className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900"><Info className="h-4 w-4"/> About</button>
          <button className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900"><HelpCircle className="h-4 w-4"/> Help</button>
          
          {user ? (
            <>
              <NavLink to="/account" className={({ isActive }) => isActive ? 'text-gray-900 inline-flex items-center gap-1.5' : 'text-gray-600 hover:text-gray-900 inline-flex items-center gap-1.5'}>
                <User className="h-4 w-4"/> My Account
              </NavLink>
              <button 
                onClick={signout}
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-800"
              >
                <LogOut className="h-4 w-4"/> Sign Out
              </button>
            </>
          ) : (
            <NavLink to="/auth" className={({ isActive }) => isActive ? 'text-gray-900 inline-flex items-center gap-1.5' : 'text-gray-600 hover:text-gray-900 inline-flex items-center gap-1.5'}>
              <User className="h-4 w-4"/> Sign In
            </NavLink>
          )}
        </nav>
      </div>
      <div className="h-0.5 w-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-cyan-500" />
    </header>
  )
}


