import { Link, NavLink } from 'react-router-dom'
import { Info, HelpCircle, User, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signout } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200/50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200">
          TryItOut.Ai
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-fuchsia-100 to-rose-100 text-fuchsia-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/app" 
            className={({ isActive }) => 
              `px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-fuchsia-100 to-rose-100 text-fuchsia-700 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            App
          </NavLink>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
            <Info className="h-4 w-4"/> 
            About
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200">
            <HelpCircle className="h-4 w-4"/> 
            Help
          </button>
          
          {user ? (
            <>
              <NavLink 
                to="/account" 
                className={({ isActive }) => 
                  `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-fuchsia-100 to-rose-100 text-fuchsia-700 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                <User className="h-4 w-4"/> 
                My Account
              </NavLink>
              <button 
                onClick={signout}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4"/> 
                Sign Out
              </button>
            </>
          ) : (
            <NavLink 
              to="/auth" 
              className={({ isActive }) => 
                `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-fuchsia-100 to-rose-100 text-fuchsia-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <User className="h-4 w-4"/> 
              Sign In
            </NavLink>
          )}
        </nav>
      </div>
      <div className="h-0.5 w-full bg-gradient-to-r from-fuchsia-500 via-rose-500 to-cyan-500" />
    </header>
  )
}


