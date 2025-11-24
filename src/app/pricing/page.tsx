import type { Metadata } from 'next';
import { Pricing } from '@/components/landing/Pricing';

export const metadata: Metadata = {
  title: 'Precios - Tincadia',
  description: 'Elige el plan que mejor se adapte a tus necesidades',
};

export default function PricingPage() {
  return <Pricing />;
}

