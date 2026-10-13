import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
export const metadata: Metadata = {
  title: 'Vijay Sagar Kanulla | AI, Analytics & Full-Stack',
  description: 'Portfolio of Vijay Sagar Kanulla — machine learning, data analytics, and full-stack projects.',
  metadataBase: new URL('https://portfolio-sagar-kanulla.vercel.app'),
  openGraph: { title: 'Vijay Sagar Kanulla — Portfolio', description: 'AI & Data Science · Data Analytics · Full-Stack Development', type: 'website' },
  robots: { index: true, follow: true }
};
export default function RootLayout({children}:{children:ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
