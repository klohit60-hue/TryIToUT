import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      <section className="bg-gradient-to-b from-pink-50 via-violet-50 to-cyan-50">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid items-center gap-10 md:grid-cols-2">
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
              <div className="aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <img
                  src="/landing-preview.png"
                  alt="TryItOut.Ai preview"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <img
                  src="/landing-preview-2.png"
                  alt="TryItOut.Ai preview 2"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="mt-4 aspect-[4/3] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <img
                  src="/landing-preview-3.png"
                  alt="TryItOut.Ai preview 3"
                  className="h-full w-full object-cover"
                />
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
            <Feature icon="🌆" title="Backgrounds" desc="Pick from Plain White, Library, Party, Beach or Office." />
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


