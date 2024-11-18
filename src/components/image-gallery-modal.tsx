"use client";

import { Dialog, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface ImageGalleryModalProps {
  children: React.ReactNode;
  openButton: React.ReactNode;
}

export default function ImageGalleryModal({
  children,
  openButton,
}: ImageGalleryModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {openButton && (
        <button onClick={() => setIsOpen(true)}>
          {openButton}
          <span className="sr-only">Fullscreen</span>
        </button>
      )}

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        transition
        className="fixed inset-0 z-30 flex w-screen items-center justify-center transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <div className="fixed inset-0 flex items-center justify-center bg-white">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-30 rounded-full bg-slate-200 p-2"
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="h-8 w-8 stroke-2 text-slate-600" />
          </button>
          <DialogPanel className="overflow-y-scroll">{children}</DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
