import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/app/lib/auth-context'; 

export const metadata: Metadata = {
  title: 'TransitOps - Fleet Operations Platform',
  description: 'Premium Smart Transport Operations Control',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-Flash Inline Theme Initialization Execution Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-50 dark:bg-[#060913] text-slate-800 dark:text-slate-100 antialiased transition-colors duration-150">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}