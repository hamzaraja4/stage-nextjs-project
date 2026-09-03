import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { AJeunAlertStrip } from "@/components/common/AJeunAlertStrip";
import { QRPreviewModal } from "@/components/common/QRPreviewModal";
import { MiseAJeunModal } from "@/components/common/MiseAJeunModal";
import { ToastProvider } from "@/context/ToastContext";
import { ToastContainer } from "@/components/common/ToastContainer";

export const metadata: Metadata = {
  title: "Restauration | Maquette Interactive des Vues & Interfaces",
  description: "Application HIS de Gestion de la Restauration Hospitalière",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        {/* FontAwesome Icons */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="bg-slate-50 text-slate-800 antialiased h-screen flex overflow-hidden font-sans">
        <AppProvider>
          <ToastProvider>
          {/* Sidebar Rétractable */}
          <Sidebar />

          {/* Main Content Container */}
          <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-100 min-w-0">
            {/* Topbar Globale */}
            <Header />

            {/* Alert Bar */}
            <AJeunAlertStrip />

            {/* Dynamic Page Views */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {children}
            </div>
          </main>

          {/* Global Modals */}
          <QRPreviewModal />
          <MiseAJeunModal />
          <ToastContainer />
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
