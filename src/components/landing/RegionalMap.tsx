'use client';

import Image from 'next/image';

export function RegionalMap() {
    return (
        <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]" id="presencia">
            <Image
                src="/media/images/world_map.png"
                alt="World map"
                fill
                className="object-contain"
            />
        </section>
    );
}
