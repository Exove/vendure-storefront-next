import type { Metadata } from "next";
import "./globals.css";
import { getLoggedInUser } from "@/common/utils-server";
import Login from "@/components/login";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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
  locale: string;
}>) {
  const activeUser = await getLoggedInUser();
  const messages = await getMessages();

  return (
    <html lang="en">
      <NextIntlClientProvider messages={messages}>
        <body
          className={`${inter.variable} bg-slate-900 font-sans text-slate-100`}
        >
          {activeUser ? children : <Login />}

          <Toaster />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
