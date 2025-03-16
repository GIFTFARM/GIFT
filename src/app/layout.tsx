import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TonConnectProvider from "./components/TonConnectProvider";
import AppWrapper from "./components/AppWrapper";
import { LanguageProvider } from "./providers/LanguageProvider";
import TelegramProvider from "./providers/TelegramProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GIFT FARM - Фарминг NFT",
  description: "Фармите монеты GIFT используя ваши NFT из определенных коллекций",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <TelegramProvider>
          <TonConnectProvider>
            <LanguageProvider>
              <AppWrapper>
                {children}
              </AppWrapper>
            </LanguageProvider>
          </TonConnectProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
