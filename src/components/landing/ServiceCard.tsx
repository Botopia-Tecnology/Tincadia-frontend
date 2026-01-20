"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ServiceCardProps {
    title: string;
    subtitle: string;
    description: string;
    backgroundImage: string;
    primaryAction: { text: string; href: string };
    secondaryAction: { text: string; href: string };
}

export function ServiceCard({
    title,
    subtitle,
    description,
    backgroundImage,
    primaryAction,
    secondaryAction,
}: ServiceCardProps) {
    return (
        <div className="max-w-xs w-full mx-auto">
            <div
                className={cn(
                    "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
                    "bg-cover bg-center",
                    // Permanent dark overlay for better text visibility
                    "after:content-[''] after:absolute after:inset-0 after:bg-black after:opacity-60",
                    "hover:after:opacity-70",
                    "transition-all duration-500"
                )}
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                }}
            >
                <div className="text relative z-50">
                    <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative drop-shadow-md">
                        {title}
                    </h1>
                    <p className="font-medium text-sm text-gray-200 relative my-2 drop-shadow-sm">
                        {subtitle}
                    </p>
                    <p className="font-normal text-sm text-gray-200 relative my-4 line-clamp-3 drop-shadow-sm">
                        {description}
                    </p>

                    <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                        <Link
                            href={primaryAction.href}
                            className="flex-1 text-center text-xs bg-[#83A98A] text-white px-3 py-2 rounded font-bold hover:bg-[#6D8F75] transition-colors"
                        >
                            {primaryAction.text}
                        </Link>
                        <Link
                            href={secondaryAction.href}
                            className="flex-1 text-center text-xs border border-white text-white px-3 py-2 rounded font-bold hover:bg-white/20 transition-colors"
                        >
                            {secondaryAction.text}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
