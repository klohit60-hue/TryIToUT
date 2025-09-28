import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Landing() {
  const slides = useMemo(
    () => [
      { src: '/static/landing-preview.png', alt: 'TryItOut.Ai preview' },
      { src: '/static/landing-preview-2.png', alt: 'TryItOut.Ai preview 2' },
      { src: '/static/landing-preview-3.png', alt: 'TryItOut.Ai preview 3' },
      { src: '/static/untitled-design-36.png', alt: 'TryItOut.Ai preview — jacket try-on' },
      { src: '/static/Untitled design (41).png', alt: 'TryItOut.Ai preview — new design' },
      { src: '/static/Untitled design (44).png', alt: 'TryItOut.Ai preview — latest design' },
    ],
    []
  )
  const [index, setIndex] = useState(0)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 3500)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [slides.length])

  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + slides.length) % slides.length)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Create <span className="italic">stunning</span> virtual try-on photos with AI
              </h1>
              <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                TryItOut.Ai is perfect for fashion brands and individuals that value quality, speed, and flexibility. 
                See how clothes look on you at a fraction of the cost.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link to="/app" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors text-center">
                  Try Now
                </Link>
                <div className="flex items-center justify-center sm:justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-green-200 dark:border-green-700 rounded-lg px-4 py-2 flex items-center">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">100 Free Credits</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <div
                  className="absolute inset-0 flex transition-transform duration-500"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {slides.map((s, i) => (
                    <img key={i} src={s.src} alt={s.alt} className="h-full w-full shrink-0 grow-0 basis-full object-cover" />
                  ))}
                </div>
                        <button aria-label="Previous" onClick={() => go(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-sm shadow hover:bg-white dark:hover:bg-gray-800 transition-colors">‹</button>
                        <button aria-label="Next" onClick={() => go(1)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 dark:bg-gray-800/80 px-3 py-2 text-sm shadow hover:bg-white dark:hover:bg-gray-800 transition-colors">›</button>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {slides.map((_, i) => (
                    <span key={i} className={`h-2 w-2 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/50'}`}></span>
                  ))}
                </div>
                        <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Created with TryItOut.Ai</span>
                        </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">How TryItOut.Ai works</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              No creative skills required - just a few clicks and you've got realistic stunning photos. 
              Experience the magic of TryItOut.Ai's AI-powered virtual try-on today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upload</h3>
              <p className="text-gray-600 dark:text-gray-300">Upload your photo and the clothing image you want to try on</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Transform</h3>
              <p className="text-gray-600 dark:text-gray-300">Select your preferred background and let our AI work its magic</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Share</h3>
              <p className="text-gray-600 dark:text-gray-300">Download and share your virtual try-on photos on social media</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why TryItOut is Better Section */}
      <section className="bg-white dark:bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Why is TryItOut Better?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See the difference between TryItOut.Ai and other virtual try-on solutions. 
              Our technology delivers superior results in record time.
            </p>
          </div>
          
          {/* Source Materials - Centered */}
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Source Materials</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Clothing and model used for the comparison</p>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6">
                <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src="/static/clothing-model-reference.png" 
                    alt="Clothing and model reference from Botika" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Side-by-Side Comparison - Full Width */}
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">Side-by-Side Comparison</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-12">See the difference in quality and speed</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-12 max-w-none">
                <div className="text-center">
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">TryItOut.Ai</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg max-w-sm mx-auto">
                      <img 
                        src="/static/tryitout-result.png" 
                        alt="TryItOut.Ai virtual try-on result" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">20 seconds</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">vs. Chat GPT</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg max-w-sm mx-auto">
                      <img 
                        src="/static/chatgpt-result.png" 
                        alt="ChatGPT virtual try-on result" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">4 minutes</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">vs. Gemini</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg max-w-sm mx-auto">
                      <img 
                        src="/static/gemini-result.png" 
                        alt="Gemini virtual try-on result" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">2 minutes</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">vs. Botika</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-lg max-w-sm mx-auto">
                      <img 
                        src="/static/botika-result.png" 
                        alt="Botika virtual try-on result" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-4 h-4 bg-gray-400 rounded-full mr-3"></div>
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">8 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          
          {/* Comparison Points - Horizontal Below */}
          <div className="mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-200 dark:bg-gray-700">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">24x Faster Generation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  TryItOut.Ai generates results in under <span className="font-semibold text-green-600 dark:text-green-400">20 seconds</span>, 
                  compared to Botika's <span className="font-semibold text-gray-600 dark:text-gray-400">8 minutes</span>. 
                  That's <span className="font-bold text-green-600 dark:text-green-400">24 times faster</span> than the competition.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-200 dark:bg-gray-700">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Superior Technical Merging</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our AI delivers <span className="font-semibold text-blue-600 dark:text-blue-400">seamless integration</span> with accurate body alignment, 
                  realistic shadows, and natural posture. Perfect skin tone transitions and garment placement 
                  create <span className="font-bold text-blue-600 dark:text-blue-400">convincing, consistent results</span> every time.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-200 dark:bg-gray-700">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Perfect Color & Texture Preservation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Unlike competitors where garment colors change and textures become inconsistent, 
                  TryItOut.Ai preserves the <span className="font-semibold text-purple-600 dark:text-purple-400">exact look, feel, and color fidelity</span> 
                  of your clothing with <span className="font-bold text-purple-600 dark:text-purple-400">hyper-accurate detail reproduction</span>.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gray-200 dark:bg-gray-700">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Professional-Grade Accuracy</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our solution eliminates inconsistencies where clothing meets the body and environment. 
                  No post-processing needed - we deliver <span className="font-semibold text-orange-600 dark:text-orange-400">production-ready results</span> 
                  with natural lighting and realistic integration for <span className="font-bold text-orange-600 dark:text-orange-400">professional applications</span>.
                </p>
              </div>
            </div>
            
            {/* The Bottom Line - Full Width */}
            <div className="mt-12">
              <div className="bg-gradient-to-r from-fuchsia-50 to-cyan-50 dark:from-fuchsia-900/20 dark:to-cyan-900/20 rounded-2xl p-8 text-center">
                <h4 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">The Bottom Line</h4>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
                  TryItOut.Ai delivers superior technical merging with seamless integration, perfect color preservation, 
                  and professional-grade accuracy. While competitors may offer appealing lifestyle contexts, 
                  our solution excels in <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">seamlessness, speed, and consistency</span> - 
                  making it the clear choice for professional applications prioritizing accuracy and workflow efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* First Ever Sequential Try-Ons Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">First Ever Sequential Try-Ons</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience the future of virtual fashion with step-by-step outfit customization
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-8">
            {/* Sequential Try-On Flow */}
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:space-x-4 xl:space-x-6">
              {/* Face Image */}
              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                  <div className="aspect-square w-32 sm:w-40 lg:w-36 xl:w-40 rounded-xl overflow-hidden">
                    <img 
                      src="/static/face01.png" 
                      alt="Face image for sequential try-on" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Start with your photo</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Shirt */}
              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                  <div className="aspect-[3/4] w-32 sm:w-40 lg:w-36 xl:w-40 rounded-xl overflow-hidden">
                    <img 
                      src="/static/shirt.png" 
                      alt="Shirt for try-on" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Add shirt</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Step 01 */}
              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                  <div className="aspect-[3/4] w-32 sm:w-40 lg:w-36 xl:w-40 rounded-xl overflow-hidden">
                    <img 
                      src="/static/step01.png" 
                      alt="Step 1: First outfit try-on" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Step 1: First outfit</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Jacket */}
              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                  <div className="aspect-[3/4] w-32 sm:w-40 lg:w-36 xl:w-40 rounded-xl overflow-hidden">
                    <img 
                      src="/static/jacket.jpeg" 
                      alt="Jacket for layering" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Add jacket</p>
              </div>

              {/* Arrow */}
              <div className="flex items-center">
                <svg className="w-6 h-6 lg:w-8 lg:h-8 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>

              {/* Step 02 */}
              <div className="text-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                  <div className="aspect-[3/4] w-32 sm:w-40 lg:w-36 xl:w-40 rounded-xl overflow-hidden">
                    <img 
                      src="/static/step02.png" 
                      alt="Step 2: Second outfit try-on" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Step 2: Mix & match</p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-indigo-100 dark:border-indigo-900/50">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  With TryItOut.Ai, for the first time customize full look step by step
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  Now mix & match different outfits to create that cool look! 
                  Build your perfect ensemble piece by piece with our revolutionary sequential try-on technology.
                </p>
                <div className="mt-6 flex justify-center">
                  <Link to="/app" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg">
                    Try Sequential Try-Ons
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Achievements Section */}
      <section className="bg-gray-900 dark:bg-gray-800 py-20">
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
      <footer className="bg-gray-900 dark:bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">T</span>
                </div>
                <span className="ml-3 text-4xl font-bold">TryItOut.Ai</span>
              </div>
                      <p className="text-gray-400 dark:text-gray-300 leading-relaxed">
                        TryItOut.Ai utilizes advanced AI to enhance your fashion experience by providing realistic virtual try-on technology. 
                        This technology helps you make confident purchasing decisions and explore new styles without the hassle of returns.
                      </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                        <li><a href="#features" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">About Us</a></li>
                        <li><a href="#how-it-works" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">How it Works</a></li>
                        <li><a href="#contact" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">Contact</a></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Support</h3>
                      <ul className="space-y-2">
                        <li><a href="mailto:tryitoutaiapp@gmail.com" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">Talk to support</a></li>
                        <li><a href="mailto:tryitoutaiapp@gmail.com" className="text-gray-400 dark:text-gray-300 hover:text-white transition-colors">Send us a message</a></li>
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
          
                      <div className="border-t border-gray-800 dark:border-gray-700 mt-12 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                          <p className="text-gray-400 dark:text-gray-300 text-sm">
                            © 2025 TryItOut.Ai, all rights reserved.
                          </p>
                          <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">Terms of service</a>
                            <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-white text-sm transition-colors">Privacy policy</a>
                          </div>
                        </div>
                      </div>
        </div>
      </footer>
    </div>
  )
}



