import React, { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

const ScrollToTopBtn = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      //show button only if not close to bottom of page
      if (document.documentElement.scrollTop > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={cn(
        "p-2 rounded-full bg-blue-500 text-white",
        !visible && "hidden"
      )}
      onClick={scrollToTop}
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default ScrollToTopBtn;
