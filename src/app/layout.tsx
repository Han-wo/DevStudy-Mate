import "./globals.css";

import { Inter } from "next/font/google";

import Providers from "@/components/provider/index";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "HobbyMate",
  description: "취미 기반 모임 매칭 서비스",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      {/* <head>
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head> */}
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
