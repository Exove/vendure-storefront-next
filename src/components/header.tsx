import Link from "next/link";
import CartMenu from "./cart-menu";
import { UserIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <header className="mx-auto flex min-h-20 max-w-screen-xl items-center justify-between py-6">
      <Link href="/">Home</Link>
      <div className="flex items-center gap-10">
        <Link href="/account">
          <UserIcon className="h-6 w-6" />
          <span className="sr-only">Account</span>
        </Link>
        <CartMenu />
      </div>
    </header>
  );
}
