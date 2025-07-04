import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Polyfill for window.dataLayer
if (typeof window !== 'undefined') {
  window.dataLayer = window.dataLayer || [];
  // Monkey-patch push to log all events
  const originalPush = window.dataLayer.push;
  window.dataLayer.push = function() {
    console.log('dataLayer push:', arguments[0]);
    return originalPush.apply(this, arguments);
  };
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
