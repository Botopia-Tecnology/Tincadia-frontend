'use client';

import { MessageCircle } from 'lucide-react';
export function FloatingWhatsAppButton() {

  // TODO: Reemplaza este número por el WhatsApp oficial de Tincadia
  // Debe incluir el código de país sin el signo '+' (Ej: 57 para Colombia)
  const phoneNumber = "573124834720";

  // El mensaje que aparecerá pre-escrito en la caja de texto de WhatsApp
  const message = "Hola equipo Tincadia, estoy interesad@ en sus soluciones de accesibilidad e inclusión.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      // Utilizamos un z-index alto para que flote sobre todo lo demás
      className="fixed bottom-6 right-6 z-[100] flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#2a8763] border-2 border-[#2a8763] rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_20px_rgba(42,135,99,0.3)] hover:-translate-y-1 transition-all duration-300 group"
      aria-label="Habla con nosotros por WhatsApp"
    >
      {/* Usamos el ícono de burbuja de chat de Lucide */}
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
      <span className="font-bold text-base sm:text-lg">Habla con nosotros</span>
    </a>
  );
}
