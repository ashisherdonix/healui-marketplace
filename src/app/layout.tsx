import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/providers/redux-provider";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Healui - Book Physiotherapy at Home | Home Visit Physiotherapists",
  description: "Book certified physiotherapists for home visits. Get professional physiotherapy treatment at home for back pain, sports injury, post-surgery care, stroke rehabilitation. Available in Delhi, Mumbai, Bangalore, Gurgaon, Pune, Chennai.",
  keywords: "physiotherapy at home, home physiotherapy, physiotherapist home visit, physio at home, home physiotherapy services, physiotherapy home service, physiotherapist near me, online physiotherapy consultation, back pain treatment at home, sports physiotherapy, post surgery physiotherapy, stroke rehabilitation at home, elderly physiotherapy, pediatric physiotherapy",
  authors: [{ name: "Healui" }],
  creator: "Healui",
  publisher: "Healui",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://healui.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Healui - Book Physiotherapy at Home | Professional Home Care',
    description: 'Book certified physiotherapists for home visits. Get professional physiotherapy treatment at your doorstep. Available across major cities in India.',
    url: 'https://healui.com',
    siteName: 'Healui',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Healui - Professional Physiotherapy at Home',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Healui - Book Physiotherapy at Home',
    description: 'Book certified physiotherapists for home visits. Professional physiotherapy at your doorstep.',
    images: ['/og-image.png'],
    creator: '@healui',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      {
        url: '/favicon.ico?v=2',
        sizes: '16x16 32x32',
        type: 'image/x-icon',
      },
      {
        url: '/favicon.png?v=2',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/icon-192.png?v=2',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/icon-512.png?v=2',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico?v=2',
    apple: [
      {
        url: '/favicon.png?v=2',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
  manifest: '/site.webmanifest?v=2',
  category: 'health',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="icon" href="/favicon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalBusiness",
              "name": "Healui",
              "description": "Book certified physiotherapists for home visits and online consultations",
              "url": "https://healui.com",
              "logo": "https://healui.com/healui-logo.png",
              "image": "https://healui.com/healui-logo.png",
              "telephone": "+91-1800-HEALUI",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "IN",
                "addressRegion": "Multiple Cities"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "28.6139",
                "longitude": "77.2090"
              },
              "areaServed": [
                "Delhi", "Mumbai", "Bangalore", "Gurgaon", "Pune", "Chennai"
              ],
              "medicalSpecialty": [
                "PhysicalTherapy",
                "Rehabilitation",
                "SportsMedicine"
              ],
              "availableService": {
                "@type": "MedicalTherapy",
                "name": "Home Physiotherapy Services",
                "description": "Professional physiotherapy treatment at your doorstep",
                "serviceType": "Physiotherapy",
                "provider": {
                  "@type": "MedicalBusiness",
                  "name": "Healui"
                }
              },
              "sameAs": [
                "https://www.facebook.com/healui",
                "https://www.instagram.com/healui",
                "https://www.linkedin.com/company/healui",
                "https://twitter.com/healui"
              ]
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1 }}>
              {children}
            </main>
            <Footer />
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
