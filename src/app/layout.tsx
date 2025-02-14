import "./globals.css";

import { dehydrate, QueryClient } from "@tanstack/react-query";
import { Inter } from "next/font/google";

import AuthInitializer from "@/components/provider/AuthInitializer";
import Providers from "@/components/provider/index";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DevMate",
  description: "개발자 AI 스터디 도우미",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = new QueryClient();
  const dehydratedState = dehydrate(queryClient);
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthInitializer />
        <Providers dehydratedState={dehydratedState}>{children}</Providers>
      </body>
    </html>
  );
}
