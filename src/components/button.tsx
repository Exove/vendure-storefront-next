"use client";

import clsx from "clsx";
import { Link } from "@/i18n/routing";

interface ButtonProps {
  style?: "primary" | "secondary" | "text" | "disabled";
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: "small" | "medium";
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
  id?: string;
}

export default function Button({
  type,
  style = "primary",
  children,
  href,
  onClick,
  size = "medium",
  fullWidth = false,
  id,
}: ButtonProps) {
  const baseStyles =
    "rounded-lg px-8 py-4 text-center break-words text-white flex justify-center";
  const sizeStyles = size === "small" && "!px-3 !py-2 !text-sm leading-tight";
  const widthStyles = fullWidth ? "w-full" : "max-w-[270px]";

  const styleVariants = {
    primary: "bg-purple-700 hover:bg-purple-600 active:bg-purple-700 font-bold",
    secondary:
      "text-slate-300 outline outline-1 outline-offset-[-2px] outline-slate-300 hover:bg-slate-900 active:bg-slate-950",
    text: "text-slate-300 hover:text-slate-200 active:text-slate-300",
    disabled: "cursor-not-allowed bg-gray-500",
  };

  if (href) {
    return (
      <Link href={href} data-testid={id}>
        <div
          className={clsx(
            baseStyles,
            styleVariants[style],
            sizeStyles,
            widthStyles,
          )}
        >
          {children}
        </div>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      type={type}
      className={clsx(
        baseStyles,
        styleVariants[style],
        sizeStyles,
        widthStyles,
      )}
      id={id}
    >
      {children}
    </button>
  );
}
