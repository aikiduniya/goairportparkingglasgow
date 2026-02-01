import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: object;
    Tawk_LoadStart?: Date;
  }
}

const TawkToChat = () => {
  useEffect(() => {
    let loaded = false;

    function loadTawk() {
      if (loaded) return;
      loaded = true;
      // Defer Tawk script injection to avoid forced reflow during interaction
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
          injectTawkScript();
        });
      } else {
        setTimeout(() => {
          requestAnimationFrame(() => {
            injectTawkScript();
          });
        }, 100);
      }
    }

    function injectTawkScript() {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      const s1 = document.createElement("script");
      s1.async = true;
      s1.src = "https://embed.tawk.to/5e2ee575daaca76c6fd00d5b/default";
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      document.body.appendChild(s1);
    }

    const events = ["scroll", "mousemove", "touchstart", "keydown"];
    events.forEach((evt) => {
      window.addEventListener(evt, loadTawk, { once: true, passive: true });
    });

    return () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, loadTawk);
      });
    };
  }, []);

  return null;
};

export default TawkToChat;
