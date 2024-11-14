import type { Metadata } from "next";
import "./globals.css";
import { getLoggedInUser } from "@/common/utils-server";
import Login from "@/components/login";

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
      <body>{activeUser ? children : <Login />}</body>
    </html>
  );
}
