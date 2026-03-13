'use client';

import { useState, useEffect } from 'react';
import { Mail, Linkedin, Instagram, Facebook, Twitter, Youtube, Music, Phone, MessageCircle, Send, PlayCircle, Github, Loader2, Save } from 'lucide-react';
import { LandingConfigItem, SocialLink } from '@/app/admin/landing/types';

const PREDEFINED_NETWORKS = [
    { name: 'LinkedIn', icon: Linkedin, color: '#0077B5' },
    { name: 'Instagram', icon: Instagram, color: '#E4405F' },
    { name: 'Facebook', icon: Facebook, color: '#1877F2' },
    { name: 'Twitter', icon: Twitter, color: '#1DA1F2' },
    { name: 'Youtube', icon: Youtube, color: '#FF0000' },
    { name: 'TikTok', icon: Music, color: '#000000' },
    { name: 'WhatsApp', icon: Phone, color: '#25D366' },
    { name: 'Discord', icon: MessageCircle, color: '#5865F2' },
    { name: 'Telegram', icon: Send, color: '#0088CC' },
    { name: 'Twitch', icon: PlayCircle, color: '#9146FF' },
    { name: 'Github', icon: Github, color: '#181717' },
];

export function SocialLinksSection({ item, onSave, saving }: {
    item: LandingConfigItem;
    onSave: (item: LandingConfigItem) => void;
    saving: string | null;
}) {
    const [links, setLinks] = useState<SocialLink[]>([]);

    useEffect(() => {
        try {
            const parsed = JSON.parse(item.value || '[]');
            setLinks(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
            setLinks([]);
        }
    }, [item.value]);

    const handleToggle = (network: string) => {
        const existing = links.find(l => l.network === network);
        if (existing) {
            setLinks(prev => prev.filter(l => l.network !== network));
        } else {
            setLinks(prev => [...prev, { id: crypto.randomUUID(), network, url: '' }]);
        }
    };

    const handleUrlChange = (network: string, url: string) => {
        setLinks(prev => prev.map(l =>
            l.network === network ? { ...l, url } : l
        ));
    };

    const handleSave = () => {
        onSave({
            ...item,
            value: JSON.stringify(links)
        });
    };

    return (
        <div className="space-y-6">
            <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                <h3 className="text-blue-200 font-semibold flex items-center gap-2">
                    <Mail className="w-5 h-5" /> Redes Sociales
                </h3>
                <p className="text-sm text-blue-300/60 mt-1">Habilita las redes sociales que deseas mostrar en la landing page.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {PREDEFINED_NETWORKS.map((net) => {
                    const activeLink = links.find(l => l.network === net.name);
                    const isActive = !!activeLink;
                    const Icon = net.icon;

                    return (
                        <div
                            key={net.name}
                            className={`p-5 rounded-xl border transition-all flex flex-col gap-4 ${isActive ? 'bg-slate-800/60 border-blue-500/30 ring-1 ring-blue-500/20' : 'bg-slate-800/20 border-white/5 opacity-60 hover:opacity-100'}`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${net.color}15` }}>
                                        <Icon className="w-5 h-5" style={{ color: net.color }} />
                                    </div>
                                    <span className="font-medium text-white">{net.name}</span>
                                </div>
                                <button
                                    onClick={() => handleToggle(net.name)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isActive ? 'bg-blue-600' : 'bg-slate-700'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>

                            {isActive && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="text-xs text-slate-500 font-medium ml-1">URL de {net.name}</label>
                                    <input
                                        type="text"
                                        placeholder={`https://www.${net.name.toLowerCase()}.com/...`}
                                        value={activeLink?.url || ''}
                                        onChange={(e) => handleUrlChange(net.name, e.target.value)}
                                        className="w-full mt-1 rounded-lg bg-slate-900/50 border border-white/10 p-3 text-white text-sm placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-end pt-6 border-t border-white/5">
                <button
                    onClick={handleSave}
                    disabled={saving === item.key}
                    className={`px-8 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2
                        ${saving === item.key ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-500/10'}`}
                >
                    {saving === item.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {saving === item.key ? 'Guardando...' : 'Guardar Todas las Redes'}
                </button>
            </div>
        </div>
    );
}
