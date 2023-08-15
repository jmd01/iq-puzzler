import "./globals.css";
import { inter } from "./fonts";

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
      <body
        className={inter.className}
        style={{ height: "100vh", overflow: "hidden" }}
      >
        {children}
      </body>
    </html>
  );
}
