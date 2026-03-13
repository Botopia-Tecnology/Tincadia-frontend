'use client';

import { 
    Linkedin, 
    Facebook, 
    Instagram, 
    Twitter, 
    Youtube, 
    Link as LinkIcon, 
    Music, 
    Phone, 
    MessageCircle, 
    Send, 
    PlayCircle, 
    Github 
} from 'lucide-react';

interface SocialIconProps {
    network: string;
    className?: string;
}

export function SocialIcon({ network, className }: SocialIconProps) {
    const net = network.toLowerCase();
    
    switch (net) {
        case 'facebook': return <Facebook className={className} />;
        case 'instagram': return <Instagram className={className} />;
        case 'linkedin': return <Linkedin className={className} />;
        case 'twitter': return <Twitter className={className} />;
        case 'youtube': return <Youtube className={className} />;
        case 'tiktok': return <Music className={className} />;
        case 'whatsapp': return <Phone className={className} />;
        case 'discord': return <MessageCircle className={className} />;
        case 'telegram': return <Send className={className} />;
        case 'twitch': return <PlayCircle className={className} />;
        case 'github': return <Github className={className} />;
        default: return <LinkIcon className={className} />;
    }
}
