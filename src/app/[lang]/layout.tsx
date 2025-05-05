import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
 
import "./globals.css";
import 'antd/dist/reset.css';
import './row.css'
import WrapperProvider from "@/provider/wrapperprovider";
import Script from "next/script";
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './components/ErrorFallback';
import MainLayout from '@/components/MainLayout';
 
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iTonziFinance - Earn by Watching",
  description: "Earn rewards by watching ads with iTonziFinance",
};

export default async function RootLayout({  children ,  params  } : {  children: React.ReactNode;  params: Promise<{ lang : string; }>;  } ) {
  const { lang } = await params;
 
  return (
    <html lang= {lang} >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
           <Script
            src="https://telegram.org/js/telegram-web-app.js"
            strategy="beforeInteractive"
          />
          <Script src="//whephiwums.com/vignette.min.js" data-zone="9093701" data-sdk='show_9093701'/>
         
        <ErrorBoundary FallbackComponent={ErrorFallback}>
     
            <WrapperProvider lang={lang}>
              <MainLayout>
                {children}
              </MainLayout>
            </WrapperProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
