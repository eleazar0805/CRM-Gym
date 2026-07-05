import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "IronPulse CRM",
  description: "CRM privado para IronPulse Gym."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
