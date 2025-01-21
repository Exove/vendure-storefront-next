import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  locale: string;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <NextIntlClientProvider messages={messages}>
        <body
          className={`${inter.variable} bg-slate-900 font-sans text-slate-100`}
        >
          {children}

          <Toaster />
        </body>
      </NextIntlClientProvider>
    </html>
  );
}
