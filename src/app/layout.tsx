import "./globals.css";
import { ToastProvider } from "@/components/ToastContext"; // <-- Added ToastProvider

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider> {/* <-- Wrapped with ToastProvider */}
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}