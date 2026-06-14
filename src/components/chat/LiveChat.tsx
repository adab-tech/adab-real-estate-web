"use client";

import Script from "next/script";

declare global {
  interface Window {
    Tawk_API?: Record<string, unknown>;
    Tawk_LoadStart?: Date;
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
  }
}

export function LiveChat() {
  const tawkPropertyId = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
  const crispWebsiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  if (tawkPropertyId) {
    const [propertyId, widgetId] = tawkPropertyId.split("/");
    if (propertyId && widgetId) {
      return (
        <Script
          id="tawk-live-chat"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/${propertyId}/${widgetId}';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      );
    }
  }

  if (crispWebsiteId) {
    return (
      <Script
        id="crisp-live-chat"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.$crisp=[];window.CRISP_WEBSITE_ID="${crispWebsiteId}";
            (function(){var d=document,s=d.createElement("script");
            s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();
          `,
        }}
      />
    );
  }

  return null;
}
