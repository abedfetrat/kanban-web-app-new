import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthStateProvider } from "./providers/AuthStateProvider";
import ThemeProvider from "./providers/ThemeProvider";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kanban Task Management",
  description: "Kanban is a task managment application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={jakarta.className} suppressHydrationWarning>
        <script
          id="noflash"
          dangerouslySetInnerHTML={{
            __html: `
            const persistedTheme = localStorage.getItem("theme");
            if (
              persistedTheme === "dark" ||
              (!persistedTheme &&
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
            ) {
              document.body.classList.add("dark");
            }
            `,
          }}
        ></script>
        <AuthStateProvider>
          <ThemeProvider>
            <Toaster
              position="bottom-center"
              toastOptions={{
                error: {
                  style: {
                    background: "#EA5555",
                    color: "#FFFFFF",
                  },
                  iconTheme: {
                    primary: "#FFFFFF",
                    secondary: "#EA5555",
                  },
                },
              }}
            />
            {children}
          </ThemeProvider>
        </AuthStateProvider>
      </body>
    </html>
  );
}
