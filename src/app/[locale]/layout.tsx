import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Footer } from "@/components/footer";
import { SHOP_NAME } from "@/common/constants";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: SHOP_NAME,
  description: "A starter template for a shop built with Vendure and Next.js",
};

export default async function RootLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head />
      <body
        className={`${inter.variable} flex min-h-screen flex-col bg-slate-900 font-sans text-slate-100`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="mt-2 flex-grow">{children}</div>
          <Footer />
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
