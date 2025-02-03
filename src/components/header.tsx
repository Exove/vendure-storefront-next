import { Link } from "@/i18n/routing";
import CartMenu from "./cart-menu";
import { UserIcon } from "@heroicons/react/24/outline";
import LanguageSwitcher from "./language-switcher";
import { SHOP_NAME } from "@/common/constants";
import SearchBox from "@/components/searchbox";
import SidePanelMenu from "./side-panel-menu";
import { MenuItem } from "@/common/get-menu-items";

type HeaderProps = {
  menuItems?: MenuItem[];
};

export default function Header({ menuItems }: HeaderProps) {
  return (
    <>
      <div className="pb-2 pt-4">
        <Link href="/" className="text-xl font-black">
          {SHOP_NAME}
        </Link>
      </div>
      <header className="sticky top-0 z-20 mx-auto w-full bg-slate-900 py-4">
        <div className="mx-auto grid max-w-screen-2xl grid-cols-1 md:grid-cols-3">
          {/* Mobile view */}
          <div className="flex items-center justify-between px-4 md:hidden">
            <div className="flex w-full items-center justify-between">
              {menuItems && <SidePanelMenu items={menuItems} />}
              <div className="block md:hidden">
                <SearchBox />
              </div>
              <LanguageSwitcher />
              <Link href="/account" className="flex items-center">
                <UserIcon className="h-6 w-6" />
                <span className="sr-only">Account</span>
              </Link>
              <CartMenu />
            </div>
          </div>

          {/* Desktop view */}
          <div className="hidden md:flex md:w-full md:items-center">
            {menuItems && <SidePanelMenu items={menuItems} />}
          </div>
          <div className="hidden w-full md:flex md:h-[50px] md:items-center md:justify-center">
            <SearchBox />
          </div>
          <div className="hidden md:flex md:w-full md:items-center md:justify-end md:gap-10">
            <LanguageSwitcher />
            <Link href="/account">
              <UserIcon className="h-6 w-6" />
              <span className="sr-only">Account</span>
            </Link>
            <CartMenu />
          </div>
        </div>
      </header>
    </>
  );
}
