import clsx from "clsx";
import { motion } from "motion/react";
import Link from "next/link";

interface ButtonProps {
  style?:
    | "primary"
    | "primary-outlined"
    | "secondary"
    | "secondary-outlined"
    | "disabled";
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
  const baseStyles =
    "rounded-lg px-8 py-4 text-center font-bold break-words text-white";
  const sizeStyles = size === "small" && "!px-6 !py-3.5 !text-sm leading-tight";
  const widthStyles = fullWidth ? "w-full" : "max-w-[270px]";

  const styleVariants = {
    primary: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
    secondary: "bg-zinc-600 hover:bg-zinc-700 active:bg-zinc-800",
    "primary-outlined":
      "text-purple-600 outline outline-2 outline-offset-[-2px] outline-purple-600 hover:bg-purple-600 hover:text-white active:bg-purple-800",
    "secondary-outlined":
      "text-zinc-600 outline outline-2 outline-offset-[-2px] outline-zinc-600 hover:bg-zinc-600 hover:text-white active:bg-zinc-800",
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
    return <Link href={href}>{innerContent}</Link>;
  }

  return (
    <motion.button
      whileHover={{ scale: style !== "disabled" ? 1.05 : 1 }}
      whileTap={{ scale: style !== "disabled" ? 1.02 : 1 }}
      onClick={onClick}
      type={type}
      className={clsx(widthStyles, "flex justify-center")}
    >
      {innerContent}
    </motion.button>
  );
}
