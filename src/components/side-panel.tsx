"use client";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ChevronRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { useTranslations } from "next-intl";
import React from "react";

interface MenuDialogProps {
  openLabel: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  fullWidthButton?: boolean;
  position?: "left" | "right";
  open?: boolean;
  title?: string;
  buttonId?: string;
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function SidePanel({
  children,
  openLabel,
  fullWidthButton = false,
  position = "right",
  footer,
  title,
  buttonId = "open-side-panel",
  showBackButton = false,
  onBack,
}: MenuDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("common");

  // Check if openLabel is a button element
  const isButtonLabel =
    React.isValidElement(openLabel) && openLabel.type === "button";

  const Trigger = isButtonLabel ? "div" : "button";

  return (
    <>
      <Trigger
        onClick={() => setIsOpen(true)}
        className={clsx(fullWidthButton && "w-full")}
        id={buttonId}
      >
        {openLabel}
      </Trigger>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog className="relative z-50" onClose={() => setIsOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom={`opacity-0 ${
              position === "left" ? "left-[-500px]" : "right-[-500px]"
            }`}
            enterTo="opacity-100 right-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 right-0"
            leaveTo={`opacity-0 ${
              position === "left" ? "left-[-500px]" : "right-[-500px]"
            }`}
          >
            <div
              className={clsx(
                "fixed top-0 h-screen w-full max-w-[500px] p-2",
                position === "left" && "left-0",
                position === "right" && "right-0",
              )}
            >
              <DialogPanel className="min-h-full w-full max-w-[500px] rounded-lg bg-slate-800 p-5">
                <div className="flex min-h-full max-w-[500px] flex-col">
                  <div className="mb-4 flex items-end justify-between">
                    {showBackButton ? (
                      <button
                        className="flex items-center gap-2 text-lg"
                        onClick={onBack}
                      >
                        <ChevronRightIcon className="h-6 w-6 rotate-180 stroke-2" />
                        {t("back")}
                      </button>
                    ) : title ? (
                      <h2 className="text-2xl font-bold">{title}</h2>
                    ) : (
                      <div />
                    )}

                    <button onClick={() => setIsOpen(false)}>
                      <span className="sr-only">{t("closeMenu")}</span>
                      <XMarkIcon className="h-10 w-10 rounded-full bg-slate-700 p-2 hover:bg-slate-600 active:bg-slate-700" />
                    </button>
                  </div>
                  <div className="mt-2 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {children}
                  </div>
                  {footer && <div>{footer}</div>}
                </div>
              </DialogPanel>
            </div>
          </TransitionChild>
        </Dialog>
      </Transition>
    </>
  );
}
