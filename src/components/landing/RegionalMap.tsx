import Image from 'next/image';
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card';

export function RegionalMap() {
    return (
        <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-center" id="presencia">
            <CardContainer className="inter-var w-full h-full max-w-6xl" containerClassName="w-full h-full py-0">
                <CardBody className="bg-transparent relative group/card w-full h-full rounded-xl border-none">
                    <CardItem translateZ="50" className="w-full h-full">
                        <div className="relative w-full h-full">
                            <Image
                                src="/media/images/world_map.png"
                                alt="World map"
                                fill
                                className="object-contain drop-shadow-2xl"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
                                priority
                            />
                        </div>
                    </CardItem>
                </CardBody>
            </CardContainer>
        </section>
    );
}
