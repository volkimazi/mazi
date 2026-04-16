import "./globals.css";

export const metadata = {
  title: "MAZI – World Travel Guide",
  description: "AI-powered travel guide for every destination",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}