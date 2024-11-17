"use client";

import useEmblaCarousel from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { useCallback } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { DotButton, useDotButton } from "./carousel-dot-button";
import clsx from "clsx";

interface CarouselProps {
  children: React.ReactNode;
  showArrows?: boolean;
  showDots?: boolean;
  modal?: boolean;
  activeIndex?: number;
}

export function Carousel({
  children,
  showArrows = false,
  showDots = true,
  modal = false,
  activeIndex = 0,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, startIndex: activeIndex },
    [WheelGesturesPlugin()],
  );

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  console.log("showDots", showDots);

  return (
    <div className="relative flex flex-col gap-6">
      <div className="flex items-center gap-1">
        {showArrows && (
          <button
            onClick={scrollPrev}
            className={clsx(
              modal
                ? "text-slate-600 absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1"
                : "text-inherit",
            )}
          >
            <ChevronLeftIcon
              className={clsx("stroke-2", modal ? "h-10 w-10" : "h-6 w-6")}
            />
            <span className="sr-only">Prew</span>
          </button>
        )}
        <div className="w-full overflow-x-hidden" ref={emblaRef}>
          <div className="-ml-4 flex md:-ml-5">{children}</div>
        </div>
        {showArrows && (
          <button
            onClick={scrollNext}
            className={clsx(
              modal
                ? "text-slate-600 absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1"
                : "text-inherit",
            )}
          >
            <ChevronRightIcon
              className={clsx("stroke-2", modal ? "h-10 w-10" : "h-6 w-6")}
            />
            <span className="sr-only">Next</span>
          </button>
        )}
      </div>

      {showDots && (
        <div className="flex justify-center gap-4 text-slate-600">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={clsx(
                "h-3 w-3 rounded-full bg-slate-600",
                index === selectedIndex && "!bg-slate-200",
              )}
            >
              <span className="sr-only">Slide {index + 1}</span>
            </DotButton>
          ))}
        </div>
      )}
      {modal && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-10 px-2 py-1 rounded-md bg-white text-black">
          {selectedIndex + 1} / {scrollSnaps.length}
        </div>
      )}
    </div>
  );
}

export function CarouselSlide({ children }: CarouselProps) {
  return (
    <div className="flex min-w-0 pl-4 md:pl-5" style={{ flex: "0 0 100%" }}>
      {children}
    </div>
  );
}
