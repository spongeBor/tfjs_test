import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ai-test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang='zh' data-theme='light'>
      <body>{children}</body>
    </html>
  );
}
