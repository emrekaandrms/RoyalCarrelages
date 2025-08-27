
import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Royal Carrelages",
    template: "%s | Royal Carrelages",
  },
  description: "Carrelages céramiques premium – collections, inspirations et conseils.",
  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },
  metadataBase: new URL("https://www.royal-carrelages.example"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning={true}>
      <head>
        {/* Canonical */}
        <link rel="canonical" href="https://www.royal-carrelages.example" />
        {/* Robots default */}
        <meta name="robots" content="index, follow" />
        {/* GA ölçüm kimliği env ile */}
        {process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GADS_ID ? (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GADS_ID}`}></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);} gtag('js', new Date());
                  ${process.env.NEXT_PUBLIC_GA_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { anonymize_ip: true });` : ''}
                  ${process.env.NEXT_PUBLIC_GADS_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GADS_ID}');` : ''}
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
