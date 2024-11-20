import Image from "next/image";
import ImageGalleryModal from "./image-gallery-modal";
import { Carousel, CarouselSlide } from "./carousel";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface ImageGalleryProps {
  images: {
    source: string;
    width: number;
    height: number;
  }[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <div className="flex justify-center">
      <div className="max-w-screen-sm">
        <Carousel showArrows={images.length > 1} showDots={images.length > 1}>
          {images.map((image, index) => {
            return (
              <CarouselSlide key={index}>
                <div className="flex w-full items-center justify-center">
                  <ImageGalleryModal
                    openButton={
                      <div className="group relative">
                        <Image
                          src={image.source}
                          alt=""
                          width={image.width}
                          height={image.height}
                          className="h-[408px] w-[544px] rounded-md object-cover"
                        />
                        <div className="absolute right-4 top-4 flex items-center justify-center rounded-full bg-black/30 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    }
                  >
                    <Carousel
                      showArrows={images.length > 1}
                      showDots={false}
                      activeIndex={index}
                      modal={true}
                    >
                      {images.map((modalImage, modalIndex) => (
                        <CarouselSlide key={modalIndex}>
                          <div className="flex w-full items-center justify-center">
                            <Image
                              src={modalImage.source}
                              alt=""
                              width={modalImage.width}
                              height={modalImage.height}
                              className="h-screen w-screen object-contain"
                            />
                          </div>
                        </CarouselSlide>
                      ))}
                    </Carousel>
                  </ImageGalleryModal>
                </div>
              </CarouselSlide>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default ImageGallery;
