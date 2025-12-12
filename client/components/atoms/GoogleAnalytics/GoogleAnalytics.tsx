"use client";
import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

const GA_MEASUREMENT_ID = "G-L09ZLTCLHW"; // GA4 property

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") {
      return;
    }

    const search = searchParams?.toString();
    const page_path = search ? `${pathname}?${search}` : pathname || "/";

    window.gtag("event", "page_view", {
      page_path,
      send_to: GA_MEASUREMENT_ID,
    });
  }, [pathname, searchParams]);

  if (!GA_MEASUREMENT_ID) {
    console.warn(
      "GA measurement ID missing: set NEXT_PUBLIC_GA_MEASUREMENT_ID"
    );
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Set default consent to 'denied' as a placeholder
            // Google's Consent Mode will update this based on user choice
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'denied'
            });
            
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { 
              send_page_view: false 
            });
          `,
        }}
      />
    </>
  );
}
