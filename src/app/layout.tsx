import "./globals.css";
import { inter } from "./fonts";

export const metadata = {
  title: "IQ PUZZLER",
  description: "Test your IQ yo",
};

const VERSION = "1.0.0";

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
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            opacity: 0.3,
            color: "#FFF",
            fontSize: 12,
          }}
        >
          {VERSION}
        </div>
      </body>
    </html>
  );
}
