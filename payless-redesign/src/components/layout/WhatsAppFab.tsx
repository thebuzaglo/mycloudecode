import { MessageCircle } from "lucide-react";
import { socials } from "@/data/site";

export default function WhatsAppFab() {
  return (
    <a
      href={socials.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="דברו איתנו בוואטסאפ"
      className="group fixed bottom-6 left-6 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366] shadow-[0_8px_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-110 hover:rounded-xl"
    >
      <span className="absolute inset-0 rounded-2xl bg-[#25D366] opacity-40 animate-ping group-hover:hidden" style={{ animationDuration: "2.6s" }} />
      <MessageCircle className="relative h-7 w-7 text-white" />
    </a>
  );
}
