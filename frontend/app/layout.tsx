import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "Sakshi's Mentor — Your Personal IAS Mentor 24/7",
  description: "AI-powered UPSC preparation platform for Sakshi. From Class 7 to IAS — your complete personal mentor system.",
  keywords: "UPSC preparation, IAS coaching, AI mentor, NCERT, current affairs, mock interview",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="min-h-screen bg-[#0a0a0f] text-[#f0f0ff] antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
