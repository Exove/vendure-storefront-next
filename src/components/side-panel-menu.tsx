"use client";

import Link from "next/link";
import SidePanel from "@/components/side-panel";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface MenuItem {
  title: string;
  url: string;
  sublinks?: MenuItem[];
}

interface SidePanelMenuProps {
  items: MenuItem[];
}

export default function SidePanelMenu({ items }: SidePanelMenuProps) {
  const [currentItems, setCurrentItems] = useState<MenuItem[]>(items);
  const [navigationStack, setNavigationStack] = useState<
    { items: MenuItem[]; title: string }[]
  >([]);

  const handleSubmenuClick = (submenuItems: MenuItem[], title: string) => {
    setNavigationStack([...navigationStack, { items: currentItems, title }]);
    setCurrentItems(submenuItems);
  };

  return (
    <SidePanel
      openLabel="Open menu"
      position="left"
      title={
        navigationStack.length > 0
          ? navigationStack[navigationStack.length - 1].title
          : undefined
      }
      showBackButton={navigationStack.length > 0}
    >
      <div className="flex w-full flex-col">
        <ul className="w-full divide-y overflow-scroll break-words p-2 text-lg">
          {currentItems?.map((item, index) => (
            <li key={`${item.url}-${index}`}>
              {!item.sublinks ? (
                <Link href={item.url} className="block p-3">
                  {item.title}
                </Link>
              ) : (
                <button
                  onClick={() => handleSubmenuClick(item.sublinks!, item.title)}
                  className="flex w-full items-center justify-between p-3 text-lg"
                >
                  {item.title}
                  <ChevronRightIcon className="h-6 w-6 stroke-2" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </SidePanel>
  );
}
