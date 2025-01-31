import { ChevronDownIcon } from "@heroicons/react/24/outline";

export function AccordionItem({
  children,
  open,
}: {
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="group" open={open}>
      {children}
    </details>
  );
}

export function AccordionTrigger({ children }: { children: React.ReactNode }) {
  return (
    <summary
      role="button"
      className="mt-6 flex w-full items-center justify-between gap-3"
    >
      <div>{children}</div>
      <ChevronDownIcon className="size-4 shrink-0 stroke-2 text-blue-400 group-open:rotate-180" />
    </summary>
  );
}

export function AccordionContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 overflow-hidden">{children}</div>;
}
