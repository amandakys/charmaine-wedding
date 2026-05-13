import { HeroGallery } from "@/components/hero/hero-gallery"

const heroImages = [
  { src: "/images/hero/1.jpg", alt: "Wedding photo 1" },
  { src: "/images/hero/2.jpg", alt: "Wedding photo 2" },
  { src: "/images/hero/3.jpg", alt: "Wedding photo 3" },
  { src: "/images/hero/4.jpg", alt: "Wedding photo 4" },
  { src: "/images/hero/5.jpg", alt: "Wedding photo 5" },
]

export default function Home() {
  return (
    <main className="bg-stone-50">
      <HeroGallery
        images={heroImages}
        title={
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white drop-shadow-lg">
              Charmaine & Partner
            </h1>
            <p className="text-lg md:text-xl text-white/80 font-light drop-shadow">
              Scroll to explore
            </p>
          </div>
        }
      />

      <section className="min-h-screen flex items-center justify-center px-8">
        <p className="text-2xl text-stone-600 font-light text-center max-w-xl">
          More sections coming soon...
        </p>
      </section>
    </main>
  )
}
