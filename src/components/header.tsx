import { Link } from "@/i18n/routing";
import CartMenu from "./cart-menu";
import { UserIcon } from "@heroicons/react/24/outline";
import LanguageSwitcher from "./language-switcher";
import { SHOP_NAME } from "@/common/constants";
import SearchBox from "@/components/searchbox";
export default function Header() {
  return (
    <header className="sticky top-0 z-20 mx-auto flex w-full max-w-screen-2xl items-center justify-between bg-slate-900 py-4">
      <Link href="/" className="text-xl font-black">
        {SHOP_NAME}
      </Link>
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
  );
}
