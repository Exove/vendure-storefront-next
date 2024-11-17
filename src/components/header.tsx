import Link from "next/link";
import CartMenu from "./cart-menu";
import { UserIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <header className="max-w-screen-xl mx-auto py-6 flex items-center justify-between">
      <Link href="/">Home</Link>
      <div className="flex gap-10 items-center">
        <Link href="/account">
          <UserIcon className="w-6 h-6" />
          <span className="sr-only">Account</span>
        </Link>
        <CartMenu />
      </div>
    </header>
  );
}
