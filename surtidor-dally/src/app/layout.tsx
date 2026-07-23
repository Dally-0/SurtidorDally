import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dally SRL — Sistema de Gestión de Combustible",
  description:
    "Sistema de gestión de combustible para estaciones de servicio Dally SRL. " +
    "Monitoreo en tiempo real de surtidores, control de ventas y alertas operacionales.",
  keywords: ["surtidores", "combustible", "gestión", "Dally SRL", "estación de servicio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
