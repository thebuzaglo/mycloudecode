import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppFab from "./WhatsAppFab";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function Layout() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <ScrollToTop />
      {/* page scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2.5px] origin-right bg-gradient-to-l from-secondary via-primary to-secondary"
        style={{ scaleX }}
      />
      <Navbar />
      <main className="flex-1 pt-[88px]">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
