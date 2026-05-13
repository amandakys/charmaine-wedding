import { HeroGallery } from "@/components/hero/hero-gallery"

const heroImages = Array.from({ length: 15 }, (_, i) => ({
  src: `/images/hero/${i + 1}.jpg`,
  alt: `Wedding photo ${i + 1}`,
}))

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
