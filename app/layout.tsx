import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tanki Wallet - Smart Time-Based Wallets",
  description: "Create smart wallets that automatically expire. Transfer funds and execute bundle transactions with a single signature.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tanki Wallet",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Tanki Wallet",
    title: "Tanki Wallet - Smart Time-Based Wallets",
    description: "Create smart wallets that automatically expire. Transfer funds and execute bundle transactions with a single signature.",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
