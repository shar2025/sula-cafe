import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sula Café | Indian-Inspired Coffee & Bakery | East Vancouver",
  description:
    "Sula Café is a takeout-only café in East Vancouver serving traditional chai, specialty Indian-origin coffee by Alai, and artisanal Indian-inspired baked goods. Located at 260 E 5th Ave.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
