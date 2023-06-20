import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "IQ PUZZLER PRO",
  description: "Test your IQ yo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ height: "100vh" }}>
      <body className={inter.className} style={{ height: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
