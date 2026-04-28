import { useLocation } from "wouter";

export function useNav() {
  const [location, setLocation] = useLocation();

  return (path: string, scrollId?: string) => {
    const samePage = location === path;

    if (samePage) {
      if (scrollId) {
        document.getElementById(scrollId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    setLocation(path);

    if (scrollId) {
      setTimeout(() => {
        document.getElementById(scrollId)?.scrollIntoView({ behavior: "smooth" });
      }, 80);
    } else {
      window.scrollTo({ top: 0 });
    }
  };
}
