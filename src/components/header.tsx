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
      <header className="sticky top-0 z-20 mx-auto flex w-full max-w-screen-2xl items-center justify-between bg-slate-900 py-4">
        <div className="flex items-center">
          {menuItems && <SidePanelMenu items={menuItems} />}
        </div>
        <div className="h-[50px] flex-1">
          <SearchBox />
        </div>
        <div className="flex items-center gap-10">
          <LanguageSwitcher />
          <Link href="/account">
            <UserIcon className="h-6 w-6" />
            <span className="sr-only">Account</span>
          </Link>
          <CartMenu />
        </div>
      </header>
    </>
  );
}
