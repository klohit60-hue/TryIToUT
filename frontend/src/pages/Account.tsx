import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { billingApi } from '../lib/api'
import { auth as fbAuth, getUserProfile } from '../firebase'
import { useNavigate, Link } from 'react-router-dom'
import { User, CreditCard, Zap, Settings, LogOut, Star, Crown, TrendingUp } from 'lucide-react'

type Profile = { 
  id: string; 
  name?: string; 
  email: string; 
  avatarUrl?: string; 
  plan: 'trial'|'pro'; 
  trialRemaining?: number;
  createdAt?: any;
}

export default function Account() {
  const { user, signout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!user) { 
        setLoading(false)
        return 
      }
      
      // Get real Firebase user profile instead of mock API
      try {
        const firebaseProfile = await getUserProfile(user.id)
        if (mounted && firebaseProfile) {
          setProfile({
            id: user.id,
            name: user.name || firebaseProfile.displayName || 'User',
            email: user.email,
            plan: firebaseProfile.plan,
            trialRemaining: firebaseProfile.trialCredits,
            createdAt: firebaseProfile.createdAt
          })
        } else if (mounted) {
          // Fallback to user data from AuthContext
          setProfile({
            id: user.id,
            name: user.name || 'User',
            email: user.email,
            plan: user.plan,
            trialRemaining: user.trialRemaining || 1
          })
        }
      } catch (error) {
        console.error('Failed to load user profile:', error)
        // Fallback to user data from AuthContext
        if (mounted) {
          setProfile({
            id: user.id,
            name: user.name || 'User',
            email: user.email,
            plan: user.plan,
            trialRemaining: user.trialRemaining || 1
          })
        }
      }
      
      if (mounted) {
        setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [user])

  // If not authenticated at all, send to /auth
  useEffect(() => {
    if (!user && !fbAuth?.currentUser && !loading) {
      navigate('/auth', { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's your account overview.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <span className="ml-3 text-gray-600">Loading your dashboard...</span>
          </div>
        ) : !user ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <User className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Please sign in</h3>
            <p className="text-gray-600 mb-6">Sign in to view your account dashboard.</p>
            <Link 
              to="/auth" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        ) : !profile ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <Settings className="h-12 w-12 text-red-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile not found</h3>
            <p className="text-gray-600">There was an issue loading your profile. Please try again.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-8">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                      <p className="text-purple-100">{profile.email}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Plan Status */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center">
                        {profile.plan === 'pro' ? (
                          <Crown className="h-8 w-8 text-yellow-500" />
                        ) : (
                          <Star className="h-8 w-8 text-blue-500" />
                        )}
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Current Plan</p>
                          <p className="text-lg font-bold text-gray-900">
                            {profile.plan === 'pro' ? 'Pro Plan' : 'Trial Plan'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Credits */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                      <div className="flex items-center">
                        <Zap className="h-8 w-8 text-green-500" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-600">Credits Available</p>
                          <p className="text-lg font-bold text-gray-900">
                            {profile.plan === 'pro' ? 'Unlimited' : `${profile.trialRemaining || 0} left`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/app"
                      className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Zap className="h-5 w-5 mr-2" />
                      Start Virtual Try-On
                    </Link>
                    
                    {profile.plan !== 'pro' && (
                      <button
                        onClick={async () => {
                          try {
                            const { url } = await billingApi.checkout()
                            window.location.href = url
                          } catch (error) {
                            console.error('Checkout failed:', error)
                          }
                        }}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Crown className="h-5 w-5 mr-2" />
                        Upgrade to Pro
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Total Try-Ons</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {profile.plan === 'pro' ? '∞' : (1 - (profile.trialRemaining || 0))}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Member Since</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <Settings className="h-4 w-4 mr-3" />
                    Account Settings
                  </button>
                  
                  <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                    <CreditCard className="h-4 w-4 mr-3" />
                    Billing & Plans
                  </button>
                  
                  <button 
                    onClick={signout}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


