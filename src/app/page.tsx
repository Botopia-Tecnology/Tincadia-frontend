import { Hero } from '@/components/landing/Hero';
import { Services } from '@/components/landing/Services';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { HowToStart } from '@/components/landing/HowToStart';
import { Testimonials } from '@/components/landing/Testimonials';
import { SignUpForms } from '@/components/landing/SignUpForms';
import { FAQ } from '@/components/landing/FAQ';

export default function Home() {
  return (
    <>
      <Hero />
      <HowToStart />
      <HowItWorks />
      <Services />
      <Testimonials />
      <SignUpForms />
      <FAQ />
    </>
  );
}
