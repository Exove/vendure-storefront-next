import { Link } from "@/i18n/routing";
import CartMenu from "./cart-menu";
import { UserIcon } from "@heroicons/react/24/outline";
import LanguageSwitcher from "./language-switcher";
import { SHOP_NAME } from "@/common/constants";

export default function Header() {
  return (
    <header className="mx-auto flex min-h-20 max-w-screen-xl items-center justify-between py-6">
      <Link href="/" className="text-xl font-black">
        {SHOP_NAME}
      </Link>
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
