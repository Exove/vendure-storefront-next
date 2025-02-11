import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

interface BreadcrumbsProps {
  items: {
    label: string;
    href: string;
  }[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="mb-5 flex text-sm text-slate-400">
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center">
          {index > 0 && <ChevronRightIcon className="mx-2 h-4 w-4 stroke-2" />}
          <Link
            href={item.href}
            className="hover:text-slate-200 hover:underline"
          >
            {item.label}
          </Link>
        </div>
      ))}
    </nav>
  );
}
