import { HeroGallery } from "@/components/hero/hero-gallery"
import { Filmstrip } from "@/components/filmstrip"
import { PhotoPile } from "@/components/photo-pile"
import { PinnedVideo } from "@/components/pinned-video"

const BENTO_IMAGES = new Set([
  "/images/young/hero-1.jpg",
  "/images/young/hero-2.jpg",
  "/images/young/hero-3.jpg",
  "/images/young/hero-4.jpg",
  "/images/young/hero-5.jpg",
])

const heroGridImages = [
  // Row 1
  "/images/young/hero-1.jpg",
  "/images/young/imgp0124.jpg",
  "/images/young/imgp0125-2.jpg",
  "/images/charmaine/imgp0114.jpg",
  "/images/young/hero-2.jpg",
  "/images/young/imgp0128-2.jpg",
  // Row 2
  "/images/young/imgp0129.jpg",
  "/images/young/imgp0130.jpg",
  "/images/young/hero-3.jpg",
  "/images/young/imgp0132.jpg",
  "/images/charmaine/imgp0122.jpg",
  "/images/young/imgp0134.jpg",
  // Row 3
  "/images/young/imgp0138.jpg",
  "/images/young/hero-4.jpg",
  "/images/young/imgp0262.jpg",
  "/images/charmaine/imgp0402-2.jpg",
  "/images/young/imgp0288.jpg",
  "/images/young/imgp0382.jpg",
  // Row 4
  "/images/young/imgp0394.jpg",
  "/images/young/3.jpg",
  "/images/young/hero-5.jpg",
  "/images/young/imgp0409.jpg",
  "/images/charmaine/imgp0597.jpg",
  "/images/young/imgp0426-2.jpg",
  // Row 5
  "/images/young/2.jpg",
  "/images/young/imgp0430.jpg",
  "/images/young/imgp0431-2.jpg",
  "/images/young/imgp0432.jpg",
  "/images/charmaine/1.jpg",
  "/images/young/imgp0592.jpg",
  // Row 6
  "/images/young/imgp0594.jpg",
  "/images/young/imgp0596.jpg",
  "/images/young/phto0003.jpg",
  "/images/young/sany0001.jpg",
  "/images/young/sunglasses.jpg",
  "/images/young/4.jpg",
].map((src) => ({
  src,
  alt: "Photo",
  isBento: BENTO_IMAGES.has(src),
}))

// First filmstrip: 5 young photos (non-bento)
const filmstrip1Images = [
  "/images/young/imgp0124.jpg",
  "/images/young/imgp0130.jpg",
  "/images/young/imgp0138.jpg",
  "/images/young/imgp0262.jpg",
  "/images/young/imgp0394.jpg",
].map((src) => ({ src, alt: "Photo" }))

// Scattered pile: remaining young photos (non-bento, not in filmstrip1)
const pileImages = [
  "/images/young/imgp0125-2.jpg",
  "/images/young/imgp0128-2.jpg",
  "/images/young/imgp0129.jpg",
  "/images/young/imgp0132.jpg",
  "/images/young/imgp0134.jpg",
  "/images/young/imgp0288.jpg",
  "/images/young/imgp0382.jpg",
  "/images/young/3.jpg",
  "/images/young/imgp0409.jpg",
  "/images/young/imgp0426-2.jpg",
  "/images/young/2.jpg",
  "/images/young/imgp0430.jpg",
  "/images/young/imgp0431-2.jpg",
  "/images/young/imgp0432.jpg",
  "/images/young/imgp0592.jpg",
  "/images/young/imgp0594.jpg",
  "/images/young/imgp0596.jpg",
  "/images/young/phto0003.jpg",
  "/images/young/sany0001.jpg",
  "/images/young/4.jpg",
  "/images/young/5.jpg",
  "/images/young/sunglasses.jpg",
].map((src) => ({ src, alt: "Photo" }))

// Filmstrip 2: all older photos
const filmstrip2Images = [
  "/images/older/img_0281.jpg",
  "/images/older/p3010407.jpg",
  "/images/older/sl381068.jpg",
  "/images/older/sl381070.jpg",
  "/images/older/sl381079.jpg",
  "/images/older/sl381082.jpg",
  "/images/older/sl381661.jpg",
].map((src) => ({ src, alt: "Photo" }))

export default function Home() {
  return (
    <main className="bg-amber-50">
      <HeroGallery images={heroGridImages} />

      <Filmstrip images={filmstrip1Images} />

      <PinnedVideo src="/videos/singing.mp4" />

      <PhotoPile images={pileImages} />

      <Filmstrip images={filmstrip2Images} />

      <PinnedVideo src="/videos/backflip.mp4" />

      <section className="relative min-h-screen flex items-center justify-center px-8 bg-amber-50">
        <div
          className="absolute inset-0 opacity-15"
          style={{ backgroundImage: `url(${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/floral-valentine.png)`, backgroundRepeat: "repeat", backgroundSize: "400px" }}
        />
        <h1 className="relative text-4xl md:text-6xl font-light tracking-tight text-center leading-relaxed" style={{ fontFamily: "Cintarini, serif", color: "#592489" }}>
          Congratulations<br />Charmaine &amp; Chris
        </h1>
      </section>
    </main>
  )
}
