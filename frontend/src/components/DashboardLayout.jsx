import React from "react";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f1a] text-white">
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
