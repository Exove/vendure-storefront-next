import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface HeadingProps {
  level: "h1" | "h2" | "h3" | "h4";
  size?: "xl" | "lg" | "md" | "sm" | "xs";
  children: string;
  className?: string;
}

// Keep track of heading text occurrences
const headingOccurrences = new Map<string, number>();

export default function Heading({
  level,
  size,
  children,
  className,
}: HeadingProps) {
  const Tag = level;

  // Create base id from the text
  const baseId = children
    .toLowerCase()
    .replace(/\u00e4/g, "a")
    .replace(/\u00f6/g, "o")
    .replace(/\W/g, "-");

  // Track occurrences and create unique id
  const count = headingOccurrences.get(baseId) || 0;
  headingOccurrences.set(baseId, count + 1);
  const id = count === 0 ? baseId : `${baseId}-${count}`;

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
