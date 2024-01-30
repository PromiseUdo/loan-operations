import { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import "../utils/services/reminderScheduler";
// import "./satoshi.css";
export const metadata: Metadata = {
  title: "Loanpay Operations",
  description: "Manage operations at Goldpay Investment Limited",
  icons: {
    icon: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <Toaster
          toastOptions={{
            style: {
              background: "rgb(51,65,85)",
              color: "#f7f7f7",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
