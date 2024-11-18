import clsx from "clsx";

interface ContainerProps {
  children: React.ReactNode;
  verticalSpacing?: boolean;
}

export default function Container({
  children,
  verticalSpacing = false,
}: ContainerProps) {
  return (
    <div
      className={clsx("mx-auto max-w-screen-xl", verticalSpacing && "py-16")}
    >
      {children}
    </div>
  );
}
