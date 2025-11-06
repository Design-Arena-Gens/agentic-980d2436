import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deepak Chaudhari | Computer System Administrator",
  description:
    "Resume of Mr. Deepak Chaudhari, a Computer System Administrator based in Pune, India with expertise in network operations and hardware lifecycle management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
