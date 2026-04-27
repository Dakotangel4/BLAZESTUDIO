import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "2349130986279";
const WHATSAPP_MESSAGE = "Hi Blaze Studio! I'd like to learn more about your services.";

export default function WhatsAppFloat() {
  const [hovered, setHovered] = useState(false);

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end gap-3">
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="bg-white text-foreground text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-lg border border-border whitespace-nowrap"
          >
            Chat with us on WhatsApp
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        {/* Pulse rings */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping [animation-delay:0.4s]" />

        <motion.a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_4px_24px_rgba(37,211,102,0.5)] cursor-pointer"
          aria-label="Chat on WhatsApp"
        >
          <FaWhatsapp className="w-7 h-7 text-white" />
        </motion.a>
      </div>
    </div>
  );
}
