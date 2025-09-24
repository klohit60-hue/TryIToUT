import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">TryItOut.Ai</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Features</a>
                <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">How it Works</a>
                <a href="#pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Pricing</a>
                <a href="#contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Contact</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/auth" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">Login</Link>
              <Link to="/app" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Try Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Create <span className="italic">stunning</span> virtual try-on photos with AI
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                TryItOut.Ai is perfect for fashion brands and individuals that value quality, speed, and flexibility. 
                See how clothes look on you at a fraction of the cost.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/app" className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 transition-colors text-center">
                  Try Now
                </Link>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="bg-white border border-green-200 rounded-lg px-4 py-2 flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">100 Free Credits</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                <img 
                  src="/static/landing-preview.png" 
                  alt="TryItOut.Ai virtual try-on example" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-600">Created with TryItOut.Ai</span>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-full"></div>
              <div className="absolute -top-4 -right-4 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-12">Trusted by thousands of fashion enthusiasts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            <div className="text-gray-400 font-semibold text-sm">FASHION BRAND</div>
            <div className="text-gray-400 font-semibold text-sm">STYLE CO.</div>
            <div className="text-gray-400 font-semibold text-sm">TREND SETTER</div>
            <div className="text-gray-400 font-semibold text-sm">FASHION HUB</div>
            <div className="text-gray-400 font-semibold text-sm">STYLE LAB</div>
            <div className="text-gray-400 font-semibold text-sm">FASHION AI</div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">How TryItOut.Ai works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No creative skills required - just a few clicks and you've got realistic stunning photos. 
              Experience the magic of TryItOut.Ai's AI-powered virtual try-on today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Upload</h3>
              <p className="text-gray-600">Upload your photo and the clothing image you want to try on</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Transform</h3>
              <p className="text-gray-600">Select your preferred background and let our AI work its magic</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Share</h3>
              <p className="text-gray-600">Download and share your virtual try-on photos on social media</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Achievements Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">With TryItOut.Ai's virtual try-on, our users achieve</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">-90%</div>
              <div className="text-gray-300">Shopping uncertainty</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">10x</div>
              <div className="text-gray-300">Faster decision making</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">+95%</div>
              <div className="text-gray-300">Confidence in purchases</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">+50%</div>
              <div className="text-gray-300">Style experimentation</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-bold text-white mb-2">+80%</div>
              <div className="text-gray-300">Shopping satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">T</span>
                </div>
                <span className="ml-2 text-xl font-bold">TryItOut.Ai</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                TryItOut.Ai utilizes advanced AI to enhance your fashion experience by providing realistic virtual try-on technology. 
                This technology helps you make confident purchasing decisions and explore new styles without the hassle of returns.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How it Works</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="mailto:tryitoutaiapp@gmail.com" className="text-gray-400 hover:text-white transition-colors">Talk to support</a></li>
                <li><a href="mailto:tryitoutaiapp@gmail.com" className="text-gray-400 hover:text-white transition-colors">Send us a message</a></li>
              </ul>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2025 TryItOut.Ai, all rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of service</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



