import { Handshake, PlayCircle, QrCode, Wrench, Map, MessageSquareQuote, Mail, HelpCircle, MoreHorizontal } from 'lucide-react';

export const EXCLUDED_KEYS = ['appstore_icon', 'playstore_icon', 'download_image_1', 'download_image_2'];
export const ALLIANCE_KEYS = ['logo_almia', 'logo_daste', 'logo_educatics', 'logo_parquete'];
export const QR_KEYS = ['qr_code_appstore', 'qr_code_generic'];
export const SERVICE_KEYS = ['service_1_bg', 'service_2_bg', 'service_3_bg'];
export const MAP_KEYS = ['world_map_dark', 'world_map_light'];
export const HOW_TO_START_KEYS = ['how_to_start_step_1', 'how_to_start_step_2', 'how_to_start_step_3', 'how_to_start_step_4'];

export const TABS = [
    { id: 'alianzas', label: 'Alianzas', icon: Handshake },
    { id: 'how_to_start', label: 'Cómo Empezar', icon: PlayCircle },
    { id: 'qrs', label: "QR's", icon: QrCode },
    { id: 'servicios', label: 'Servicios', icon: Wrench },
    { id: 'mapas', label: 'Mapas', icon: Map },
    { id: 'testimonios', label: 'Casos de Éxito', icon: MessageSquareQuote },
    { id: 'inclusive_companies', label: 'Empresas Inclusivas', icon: Handshake },
    { id: 'contact_social', label: 'Contacto y Redes', icon: Mail },
    { id: 'faqs', label: 'FAQ', icon: HelpCircle },
    { id: 'otros', label: 'Otros', icon: MoreHorizontal },
];
