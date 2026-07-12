import React from 'react';
import './globals.css'; // Ensures Tailwind styles load across all routes

export const metadata = {
  title: 'TransitOps - Smart Transport Core',
  description: 'Enterprise Fleet & Logistics Optimization Engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}