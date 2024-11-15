import Link from "next/link";
import CartMenu from "./cart-menu";
import Logout from "./logout";
import { useContext } from "react";
import { CartContext } from "@/app/templates/product-template";

export default function Header() {
  return (
    <header className="max-w-screen-xl mx-auto py-6 flex items-center justify-between">
      <Link href="/">Home</Link>
      <div className="flex gap-10 items-center">
        <Link href="/checkout">Checkout</Link>
        <Link href="/account">Account</Link>
        <Logout />
        <CartMenu />
      </div>
    </header>
  );
}
