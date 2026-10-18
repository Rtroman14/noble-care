import { Bebas_Neue, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DemoStoreProvider } from "@/lib/demo-store";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NobleCare by Noble Roofing",
  description: "Roof health, inspections and fast leak response for RAMP members.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${bebas.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <DemoStoreProvider>
          <Toaster>
            <TooltipProvider>{children}</TooltipProvider>
          </Toaster>
        </DemoStoreProvider>
      </body>
    </html>
  );
}
