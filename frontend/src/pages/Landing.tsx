import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'

export default function Landing() {
  const slides = useMemo(
    () => [
      { src: '/landing-preview.png', alt: 'TryItOut.Ai preview' },
      { src: '/landing-preview-2.png', alt: 'TryItOut.Ai preview 2' },
      { src: '/landing-preview-3.png', alt: 'TryItOut.Ai preview 3' },
      { src: '/untitled-design-36.png', alt: 'TryItOut.Ai preview — jacket try-on' },
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
    <div>
      <section className="bg-gradient-to-b from-pink-50 via-violet-50 to-cyan-50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent">
                TryItOut.Ai — try outfits on yourself
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Upload your photo and a clothing image. We swap the top while keeping your face and body intact — with realistic lighting and shadows.
              </p>
              <div className="mt-8 flex gap-3">
                <Link to="/app" className="rounded-lg bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white shadow hover:opacity-90">
                  Get Started
                </Link>
                <a href="#features" className="rounded-lg border border-fuchsia-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-white/60">
                  Learn more
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div
                  className="absolute inset-0 flex transition-transform duration-500"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                >
                  {slides.map((s, i) => (
                    <img key={i} src={s.src} alt={s.alt} className="h-full w-full shrink-0 grow-0 basis-full object-cover" />
                  ))}
                </div>
                <button aria-label="Previous" onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-sm shadow hover:bg-white">‹</button>
                <button aria-label="Next" onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1 text-sm shadow hover:bg-white">›</button>
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {slides.map((_, i) => (
                    <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-fuchsia-600' : 'bg-gray-300'}`}></span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent">Why TryItOut.Ai?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <Feature icon="✨" title="Realistic results" desc="Face, body and proportions are preserved. Natural shadows retained." />
            <Feature icon="🧥" title="Upload any top" desc="Use any clothing image — T-shirts, shirts, hoodies and more." />
            <Feature icon="🌆" title="Backgrounds" desc="Pick from many environments to match your vibe." />
            <Feature icon="⚡" title="Fast" desc="Generate results in seconds with our optimized pipeline." />
            <Feature icon="🔒" title="Private" desc="Images are processed just for your session and can be deleted." />
            <Feature icon="⬇️" title="Download & share" desc="Save your results or share them right from the gallery." />
          </div>
        </div>
      </section>
    </div>
  )
}

function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-base font-medium">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{desc}</div>
    </div>
  )
}


