import type { Metadata, Viewport } from "next";
import { Cinzel, Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cinzel({ subsets: ["latin"], variable: "--font-display", weight: ["400", "700", "900"] });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

const TITLE = "The Age of Dragons — a lenda que moldou a imaginação humana";
const DESCRIPTION =
  "Uma experiência cinematográfica sobre os dragões mais icônicos da mitologia e da ficção: das lendas chinesas e nórdicas a Smaug, Drogon e Toothless. Um documentário interativo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://age-of-dragons.vercel.app"),
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/video/poster.webp", width: 1200, height: 692 }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#090909",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "The Age of Dragons",
  inLanguage: "pt-BR",
  description: DESCRIPTION,
  genre: ["Mythology", "Pop culture", "Interactive documentary"],
  creator: { "@type": "Organization", name: "MilWeb", url: "https://milweb.com.br" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${serif.variable} ${sans.variable}`}>
      <body className="bg-abyss text-bone antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
