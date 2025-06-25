import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "StampRush",
  description: "Proof of Contact",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${beVietnamPro.variable} antialiased`}
      >
        <Navigation />
        {children}
      </body>
    </html>
  );
}
