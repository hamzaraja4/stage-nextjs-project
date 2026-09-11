"use client";

import React from "react";
import Header from "./header";
import SideNav from "./side-nav";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Navigation Latérale Rétractable */}
      <SideNav />

      {/* Zone d'Application Principale */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto custom-scrollbar p-card">
          {children}
        </div>
      </main>
    </div>
  );
}
