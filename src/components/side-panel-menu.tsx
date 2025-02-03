"use client";

import Link from "next/link";
import SidePanel from "@/components/side-panel";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface MenuItem {
  title: string;
  url: string;
  sublinks?: MenuItem[];
}

interface SidePanelMenuProps {
  items: MenuItem[];
}

export default function SidePanelMenu({ items }: SidePanelMenuProps) {
  return (
    <SidePanel openLabel="Open menu" position="left">
      <ul className="w-full divide-y overflow-scroll break-words p-2 text-lg">
        {items?.map((item) => (
          <li key={item.url}>
            {!item.sublinks ? (
              <Link href={item.url} className="block p-3">
                {item.title}
              </Link>
            ) : (
              <SidePanelSubmenu items={item.sublinks} title={item.title} />
            )}
          </li>
        ))}
      </ul>
    </SidePanel>
  );
}

interface SidePanelSubmenuProps {
  items: MenuItem[];
  title: string;
}

function SidePanelSubmenu({ items, title }: SidePanelSubmenuProps) {
  return (
    <SidePanel
      openLabel={
        <div className="flex w-full items-center justify-between p-3 text-lg">
          {title}
          <ChevronRightIcon className="h-6 w-6 stroke-2" />
        </div>
      }
      title={title}
      fullWidthButton
      position="left"
      showBackButton
    >
      <div className="flex w-full flex-col">
        <ul className="w-full divide-y break-words px-4">
          {items.map((menuItem, index) => (
            <li key={`${menuItem.url}-${index}`}>
              <Link href={menuItem.url} className="block py-3 text-lg">
                {menuItem.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </SidePanel>
  );
}
