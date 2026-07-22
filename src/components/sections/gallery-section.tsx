import Image from "next/image";
import { GALLERY } from "@/data/gallery";
import { ChapterMark } from "@/components/icons/chapter-mark";

export function GallerySection() {
  return (
    <section id="galeria" className="mx-auto max-w-7xl px-6 py-32 sm:px-10">
      <ChapterMark />
      <p className="eyebrow" data-reveal>
        Capítulo V · A galeria
      </p>
      <h2 className="mt-4 text-4xl font-bold text-bone sm:text-6xl" data-chars>
        O acervo proibido.
      </h2>
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {GALLERY.map((item, i) => {
          const isLast = i === GALLERY.length - 1;
          return (
            <figure
              key={item.src}
              data-reveal
              className={`gallery-card group relative overflow-hidden rounded-2xl border border-gold/15 ${isLast ? "md:col-span-2" : ""}`}
            >
              <div className={`relative w-full ${isLast ? "h-[520px]" : "h-[420px]"}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  loading="lazy"
                  sizes={isLast ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
                  className="object-cover"
                />
              </div>
              <figcaption className="museum-caption absolute bottom-0 left-0 z-10 w-full bg-gradient-to-t from-abyss via-abyss/60 to-transparent p-5 pt-14">
                {item.label}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
