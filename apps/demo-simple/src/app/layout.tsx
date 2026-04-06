import type { Metadata } from "next";
import "@squaredr/formengine-react/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "FormEngine Demo",
  description: "Simple FormEngine demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
