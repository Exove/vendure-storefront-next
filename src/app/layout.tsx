import type { Metadata } from "next";
import "./globals.css";
import { getLoggedInUser } from "@/common/utils-server";
import Link from "next/link";
import Login from "@/components/login";
import Logout from "@/components/logout";
import CartMenu from "@/components/cart-menu";

export const metadata: Metadata = {
  title: "REBL Shop",
  description: "Get your favorite REBL products here!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const activeUser = await getLoggedInUser();

  return (
    <html lang="en">
      <body>
        <header className="max-w-screen-xl mx-auto py-6 flex items-center justify-between">
          <Link href="/">Home</Link>
          <div className="flex gap-10 items-center">
            <Link href="/checkout">Checkout</Link>
            <Link href="/account">Account</Link>
            {activeUser && <Logout />}
            <CartMenu />
          </div>
        </header>
        <main>{activeUser ? children : <Login />}</main>
      </body>
    </html>
  );
}
