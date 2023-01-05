import { useEffect, useRef } from "react";

function addRaychatToPage(): HTMLScriptElement {
  let scriptTag = document.createElement("script");
  scriptTag.type = "text/javascript";
  scriptTag.async = true;

  const query = [`href=${window.location.href}`];
  if (localStorage.getItem("rayToken"))
    query.push(`rid=${localStorage.getItem("rayToken")}`);

  const token = "9c688344-9fb1-43b7-8da0-15bfc44c2420";
  scriptTag.src = `https://app.raychat.io/scripts/js/${token}?${query.join(
    "&"
  )}`;

  document.body.appendChild(scriptTag);
  return scriptTag;
}

function removeRaychatFromPage(scriptTag: HTMLScriptElement) {
  function removeElementsBySelector(selector: string) {
    document.querySelectorAll(selector).forEach((element) => element.remove());
  }

  localStorage.removeItem("rayToken");
  removeElementsBySelector("#raychatFrame + link");
  removeElementsBySelector("#raychatFrame + style");
  removeElementsBySelector("#raychatFrame");
  removeElementsBySelector("#raychat_automessage_preview_container");
  removeElementsBySelector("#raychatBtn");
  scriptTag.remove();
}

export default function RayChat() {
  const scriptTagRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (document.readyState === "complete") {
      scriptTagRef.current = addRaychatToPage();
    } else {
      window.addEventListener("load", () => {
        scriptTagRef.current = addRaychatToPage();
      });
    }

    return () => {
      if (scriptTagRef.current) removeRaychatFromPage(scriptTagRef.current);
    };
  }, []);

  return <></>;
}
