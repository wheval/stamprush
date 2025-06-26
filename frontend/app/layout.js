import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation.jsx";
import { StarknetProvider } from "@/lib/starknet-provider";
import { Toaster } from "react-hot-toast";

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
        <StarknetProvider>
        <Navigation />
        {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </StarknetProvider>
      </body>
    </html>
  );
}
