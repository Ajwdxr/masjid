import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Zahir Digital | Masjid Zahir, Alor Setar",
    template: "%s | Zahir Digital",
  },
  description:
    "Sistem digital rasmi Masjid Zahir, Alor Setar, Kedah. Waktu solat, pengumuman, infaq, dan aduan.",
  keywords: [
    "Masjid Zahir",
    "Alor Setar",
    "Kedah",
    "waktu solat",
    "infaq",
    "masjid digital",
  ],
  authors: [{ name: "Masjid Zahir" }],
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ms" className="dark">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased islamic-pattern min-h-screen`}
      >
        <Navbar />
        <main className="min-h-screen pb-20 md:pb-0">{children}</main>
        <Footer />
        <MobileNav />
      </body>
    </html>
  );
}
