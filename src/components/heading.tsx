import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface HeadingProps {
  level: "h1" | "h2" | "h3" | "h4";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
  children: string;
  className?: string;
}

export default function Heading({
  level,
  size,
  children,
  className,
}: HeadingProps) {
  const Tag = level;

  // ID is used for anchor links.
  const id = children
    .toLowerCase()
    .replace(/\u00e4/g, "a")
    .replace(/\u00f6/g, "o")
    .replace(/\W/g, "-");

  return (
    <Tag
      className={twMerge(
        clsx(
          "break-words font-bold",
          size === "xl" && "mb-10 text-3xl lg:text-4xl lg:leading-tight",
          size === "lg" && "mb-6 text-2xl lg:text-3xl",
          size === "md" && "mb-6 text-xl lg:text-2xl",
          size === "sm" && "mb-4 text-lg",
          size === "xs" && "mb-4 text-base",
        ),
        className,
      )}
      id={id}
    >
      {children}
    </Tag>
  );
}
