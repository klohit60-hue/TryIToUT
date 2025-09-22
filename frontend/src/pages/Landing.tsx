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
          <div className="mt-8 max-w-4xl">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Shopping for clothes online often comes with uncertainty — Will this outfit really suit me? Will the size or style look right on my body? These doubts are one of the biggest reasons why customers hesitate to buy and why returns remain so high in fashion e-commerce.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong className="text-gray-900">TryItOut.Ai solves this problem.</strong>
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We use advanced AI to let shoppers virtually "try on" outfits before making a purchase. By uploading a photo, users can instantly see how an outfit would look on their own body, in their own proportions — not on a model who may look completely different.
            </p>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section id="founder" className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent mb-8">
              Meet Our Founder
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img 
                  src="/static/founder-photo.png" 
                  alt="Kasimahanti Lohitaksha" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">Kasimahanti Lohitaksha</h3>
                <p className="text-lg text-gray-600">Founder & CEO</p>
                <p className="text-sm text-gray-500 mt-2 max-w-md">
                  Leading the vision to revolutionize virtual try-on technology and make fashion accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-b from-white to-fuchsia-50/40">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="rounded-2xl border border-fuchsia-200/60 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 bg-clip-text text-transparent">
              Contact
            </h2>
            <p className="mt-3 text-gray-600">
              Have a question, feedback, or partnership idea? We’d love to hear from you.
            </p>
            <div className="mt-5">
              <a
                href="mailto:tryitoutaiapp@gmail.com"
                className="inline-flex items-center rounded-lg bg-gradient-to-r from-fuchsia-600 via-rose-500 to-cyan-500 px-5 py-3 text-sm font-medium text-white shadow hover:opacity-90"
              >
                Email us at: tryitoutaiapp@gmail.com
              </a>
            </div>
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


