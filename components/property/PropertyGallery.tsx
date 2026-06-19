import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/constants";

type PropertyGalleryProps = {
  title: string;
  image: string;
};

export default function PropertyGallery({
  title,
  image,
}: PropertyGalleryProps) {
  return (
    <section className="px-6 pt-32 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative h-[320px] overflow-hidden rounded-[32px] shadow-2xl md:h-[560px]">
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}