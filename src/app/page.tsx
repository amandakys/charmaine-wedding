import { HeroGallery } from "@/components/hero/hero-gallery"

const heroImages = [
  // First 5 are the bento grid
  { src: "/images/young/hero-1.jpg", alt: "Wedding photo" },
  { src: "/images/young/hero-2.jpg", alt: "Wedding photo" },
  { src: "/images/young/hero-3.jpg", alt: "Wedding photo" },
  { src: "/images/young/hero-4.jpg", alt: "Wedding photo" },
  { src: "/images/young/hero-5.jpg", alt: "Wedding photo" },
  // Remaining 10 float in the background
  { src: "/images/young/imgp0124.jpg", alt: "Photo" },
  { src: "/images/young/imgp0129.jpg", alt: "Photo" },
  { src: "/images/young/imgp0130.jpg", alt: "Photo" },
  { src: "/images/young/imgp0132.jpg", alt: "Photo" },
  { src: "/images/young/imgp0134.jpg", alt: "Photo" },
  { src: "/images/young/imgp0138.jpg", alt: "Photo" },
  { src: "/images/young/imgp0262.jpg", alt: "Photo" },
  { src: "/images/young/imgp0288.jpg", alt: "Photo" },
  { src: "/images/young/imgp0382.jpg", alt: "Photo" },
  { src: "/images/young/imgp0394.jpg", alt: "Photo" },
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
