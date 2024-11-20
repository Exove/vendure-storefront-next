"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import Link from "next/link";

interface ButtonProps {
  style?: "primary" | "secondary" | "text" | "disabled";
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  size?: "small" | "medium";
  type?: "button" | "submit" | "reset";
  fullWidth?: boolean;
}

export default function Button({
  type,
  style = "primary",
  children,
  href,
  onClick,
  size = "medium",
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = "rounded-lg px-8 py-4 text-center break-words text-white";
  const sizeStyles = size === "small" && "!px-3 !py-2 !text-sm leading-tight";
  const widthStyles = fullWidth ? "w-full" : "max-w-[270px]";

  const styleVariants = {
    primary: "bg-purple-700 hover:bg-purple-600 active:bg-purple-700 font-bold",
    secondary:
      "text-slate-300 outline outline-1 outline-offset-[-2px] outline-slate-300 hover:bg-slate-900 active:bg-slate-950",
    text: "text-slate-300 hover:text-slate-200 active:text-slate-300",
    disabled: "cursor-not-allowed bg-gray-500",
  };

  const innerContent = (
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
  );

  if (href) {
    return (
      <Link href={href}>
        <motion.div
          whileHover={{ scale: style !== "disabled" ? 1.02 : 1 }}
          whileTap={{ scale: style !== "disabled" ? 1.0 : 1 }}
          className="flex justify-center"
        >
          {innerContent}
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={{
        scale: style === "primary" ? 1.01 : 1,
      }}
      whileTap={{ scale: style === "primary" ? 1.0 : 1 }}
      onClick={onClick}
      type={type}
      className={clsx(widthStyles, "flex justify-center")}
    >
      {innerContent}
    </motion.button>
  );
}
