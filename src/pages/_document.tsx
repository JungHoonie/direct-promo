import { Html, Head, Main, NextScript } from "next/document";
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
        
        {/* Preload Images */}
        <link rel="preload" href="/images/categories/dp_logo_final.png" as="image" />
        <link rel="preload" href="/images/categories/hero_img_ribbon.png" as="image" />
        
        {/* SEO Meta Tags */}
        <title>DirectPromo | Promotional Products, Custom Pens and Branded Business Apparel</title>
        <meta name="description" content="DirectPromo offers custom promotional products, branded pens, and business apparel for effective marketing. Fast turnaround and expert service in Toronto." />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="DirectPromo | Promotional Products, Custom Pens and Branded Apparel" />
        <meta property="og:description" content="Toronto's source for custom promotional products, branded pens, and business apparel. Fast turnaround and expert service." />
        <meta property="og:image" content="https://directpromo.ca/images/og-image.jpg" />
        <meta property="og:url" content="https://directpromo.ca/" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DirectPromo | Promotional Products, Custom Pens and Branded Apparel" />
        <meta name="twitter:description" content="Toronto's source for custom promotional products, branded pens, and business apparel." />
        <meta name="twitter:image" content="https://directpromo.ca/images/og-image.jpg" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://directpromo.ca/" />
        
        {/* Favicon */}
        <link rel="shortcut icon" type="image/x-icon" href="https://fonts.gstatic.com/s/i/googlematerialicons/more/v6/gm_blue-48dp/1x/gm_more_gm_blue_48dp.png" />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MTRDWHQV');`
          }}
        />
        
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-J2529PY042"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-J2529PY042');`
          }}
        />
        
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "DirectPromo",
              "image": "https://directpromo.ca/images/og-image.jpg",
              "telephone": "+1-416-895-0929",
              "email": "directpromo@rogers.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "151 Beecroft Rd",
                "addressLocality": "North York",
                "addressRegion": "ON",
                "postalCode": "M2N 7C4",
                "addressCountry": "CA"
              },
              "url": "https://directpromo.ca/",
              "description": "Toronto's trusted source for custom promotional products, branded pens, and business apparel."
            })
          }}
        />
        
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "I don't see the type of apparel I want — can you source other items?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! While our website showcases a curated selection of popular products, we have access to thousands more through our trusted suppliers. Whether you're looking for a specific brand, cut, fabric, or specialty item, just reach out — we'll be happy to help you find the perfect fit."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the expected delivery times?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Delivery timelines typically range from 7 to 15 business days, depending on the product, quantity, and customization required. Rush orders may be available upon request. Once you request a quote, we'll provide a clear timeline with estimated delivery dates tailored to your order."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Who are your suppliers?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We partner with some of the most reputable names in the industry, including SanMar, Alphabroder, and other leading suppliers. These relationships allow us to offer a wide selection of high-quality products and ensure reliable sourcing, printing, and fulfillment."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I see a sample before placing a large order?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Absolutely. We offer samples on most items so you can review quality, fit, and finish before committing to a larger run. Let us know what you're considering and we'll walk you through the sample request process."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What kind of artwork files do you accept?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We prefer vector files (AI, EPS, or PDF), but we can also work with high-resolution PNG or JPG images. If you're unsure, send us what you have — our design team can help convert your logo or artwork to the required format."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is there a minimum order quantity (MOQ)?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "MOQs vary depending on the product and supplier, but many items start at as few as 12 or 24 units. We'll confirm specific MOQs when you request a quote."
                  }
                }
              ]
            })
          }}
        />
      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MTRDWHQV"
height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MTRDWHQV');`
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
