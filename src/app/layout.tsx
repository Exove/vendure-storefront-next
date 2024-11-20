import type { Metadata } from "next";
import "./globals.css";
import { getLoggedInUser } from "@/common/utils-server";
import Login from "@/components/login";

import { Inter } from "next/font/google";
import { Toaster } from "@/components/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

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
      <body
        className={`${inter.variable} bg-slate-900 font-sans text-slate-100`}
      >
        {activeUser ? children : <Login />}

        <Toaster />
      </body>
    </html>
  );
}
