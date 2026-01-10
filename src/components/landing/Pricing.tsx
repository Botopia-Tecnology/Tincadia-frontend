'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Users, CreditCard, Crown, Check, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

type UserType = 'personal' | 'empresa';
type BillingCycle = 'mensual' | 'anual';

interface Plan {
  name: string;
  price: string;
  priceAnnual?: string;
  description: string;
  buttonText: string;
  buttonIcon: React.ReactNode;
  includes: string[];
  excludes: string[];
}

export function Pricing() {
  const t = useTranslation();
  const [userType, setUserType] = useState<UserType>('personal');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('mensual');
  const [plans, setPlans] = useState<Record<UserType, Plan[]>>({
    personal: [],
    empresa: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fallback plans from i18n
  const fallbackPlans: Record<UserType, Plan[]> = useMemo(() => {
    const getArray = (key: string): string[] => {
      const value = t(key);
      return Array.isArray(value) ? value : [];
    };

    return {
      personal: [
        {
          name: t('pricing.plans.personal.free.name'),
          price: t('pricing.free'),
          description: t('pricing.plans.personal.free.description'),
          buttonText: t('pricing.plans.personal.free.buttonText'),
          buttonIcon: <Users className="w-4 h-4" />,
          includes: getArray('pricing.plans.personal.free.includes'),
          excludes: getArray('pricing.plans.personal.free.excludes'),
        },
        {
          name: t('pricing.plans.personal.premium.name'),
          price: '0',
          priceAnnual: '0',
          description: t('pricing.plans.personal.premium.description'),
          buttonText: t('pricing.plans.personal.premium.buttonText'),
          buttonIcon: <CreditCard className="w-4 h-4" />,
          includes: getArray('pricing.plans.personal.premium.includes'),
          excludes: getArray('pricing.plans.personal.premium.excludes'),
        },
        {
          name: t('pricing.plans.personal.corporate.name'),
          price: '0',
          priceAnnual: '0',
          description: t('pricing.plans.personal.corporate.description'),
          buttonText: t('pricing.plans.personal.corporate.buttonText'),
          buttonIcon: <Crown className="w-4 h-4" />,
          includes: getArray('pricing.plans.personal.corporate.includes'),
          excludes: getArray('pricing.plans.personal.corporate.excludes'),
        },
      ],
      empresa: [
        {
          name: t('pricing.plans.empresa.free.name'),
          price: t('pricing.free'),
          description: t('pricing.plans.empresa.free.description'),
          buttonText: t('pricing.plans.empresa.free.buttonText'),
          buttonIcon: <Users className="w-4 h-4" />,
          includes: getArray('pricing.plans.empresa.free.includes'),
          excludes: getArray('pricing.plans.empresa.free.excludes'),
        },
        {
          name: t('pricing.plans.empresa.business.name'),
          price: '0',
          priceAnnual: '0',
          description: t('pricing.plans.empresa.business.description'),
          buttonText: t('pricing.plans.empresa.business.buttonText'),
          buttonIcon: <CreditCard className="w-4 h-4" />,
          includes: getArray('pricing.plans.empresa.business.includes'),
          excludes: getArray('pricing.plans.empresa.business.excludes'),
        },
        {
          name: t('pricing.plans.empresa.corporate.name'),
          price: '0',
          priceAnnual: '0',
          description: t('pricing.plans.empresa.corporate.description'),
          buttonText: t('pricing.plans.empresa.corporate.buttonText'),
          buttonIcon: <Crown className="w-4 h-4" />,
          includes: getArray('pricing.plans.empresa.corporate.includes'),
          excludes: getArray('pricing.plans.empresa.corporate.excludes'),
        },
      ],
    };
  }, [t]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/content/pricing/plans`);
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const apiPlans: Record<UserType, Plan[]> = {
            personal: [],
            empresa: []
          };

          data.forEach(p => {
            const icon = p.name.toLowerCase().includes('premium') || p.name.toLowerCase().includes('negocios') ?
              <CreditCard className="w-4 h-4" /> :
              p.name.toLowerCase().includes('free') || p.name.toLowerCase().includes('gratis') ?
                <Users className="w-4 h-4" /> :
                <Crown className="w-4 h-4" />;

            const mapped: Plan = {
              name: p.name,
              price: p.price_monthly,
              priceAnnual: p.price_annual,
              description: p.description,
              buttonText: p.button_text || 'Empezar',
              includes: p.includes || [],
              excludes: p.excludes || [],
              buttonIcon: icon,
              ...p // keep id etc
            };

            if (p.type === 'personal') apiPlans.personal.push(mapped);
            else if (p.type === 'empresa') apiPlans.empresa.push(mapped);
          });

          setPlans(apiPlans);
        } else {
          setPlans(fallbackPlans);
        }
      } catch (error) {
        console.error(error);
        setPlans(fallbackPlans);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [fallbackPlans]);

  // Use state plans or fallback while loading (or just fallback if loading to avoid flash?)
  const currentPlans = (isLoading || plans.personal.length === 0) ? fallbackPlans[userType] : plans[userType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Selector de tipo de usuario */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg bg-gray-800 p-1 border border-gray-700">
            <button
              type="button"
              onClick={() => setUserType('personal')}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${userType === 'personal'
                ? 'bg-[#83A98A] text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              {t('pricing.personal')}
            </button>
            <button
              type="button"
              onClick={() => setUserType('empresa')}
              className={`px-6 py-2 rounded-md text-sm font-semibold transition-all ${userType === 'empresa'
                ? 'bg-[#83A98A] text-white shadow-lg'
                : 'text-gray-300 hover:text-white'
                }`}
            >
              {t('pricing.empresa')}
            </button>
          </div>
        </div>

        {/* Toggle de facturación */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <span
            className={`text-sm font-medium ${billingCycle === 'mensual' ? 'text-white' : 'text-gray-400'
              }`}
          >
            {t('pricing.mensual')}
          </span>
          <button
            type="button"
            onClick={() =>
              setBillingCycle(billingCycle === 'mensual' ? 'anual' : 'mensual')
            }
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#83A98A] focus:ring-offset-2 focus:ring-offset-gray-900"
            role="switch"
            aria-checked={billingCycle === 'anual'}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingCycle === 'anual' ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
          <div className="relative flex items-center">
            <span
              className={`text-sm font-medium min-w-[50px] ${billingCycle === 'anual' ? 'text-white' : 'text-gray-400'
                }`}
            >
              {t('pricing.anual')}
            </span>
            {billingCycle === 'anual' && (
              <span className="absolute left-full ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-[#83A98A] rounded whitespace-nowrap">
                {t('pricing.save20')}
              </span>
            )}
          </div>
        </div>

        {/* Cards de planes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPlans.map((plan: any, index) => {
            const displayPrice =
              billingCycle === 'anual' && plan.priceAnnual
                ? plan.priceAnnual
                : plan.price;
            const isFree = plan.price === t('pricing.free') || plan.price === 'Gratis';

            return (
              <div
                key={index}
                className="relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-[#83A98A] transition-all hover:shadow-2xl hover:shadow-[#83A98A]/20"
              >
                {/* Header del plan */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    {isFree ? (
                      <p className="text-3xl font-bold text-white">{plan.price}</p>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold text-white">
                          {displayPrice.split(' ')[1] || displayPrice}
                        </span>
                        {billingCycle === 'anual' ? (
                          <span className="text-gray-400 ml-2">{t('pricing.perYear')}</span>
                        ) : (
                          <span className="text-gray-400 ml-2">{t('pricing.perMonth')}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm">{plan.description}</p>
                </div>

                {/* Botón CTA */}
                <Link
                  href="#"
                  className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 rounded-lg px-6 py-3 font-semibold hover:bg-gray-100 transition-colors mb-8"
                >
                  {plan.buttonIcon}
                  {plan.buttonText}
                </Link>

                {/* Incluye */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                    {t('pricing.includes')}
                  </h4>
                  <ul className="space-y-3">
                    {plan.includes.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#83A98A] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* No incluye */}
                {plan.excludes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                      {t('pricing.notIncludes')}
                    </h4>
                    <ul className="space-y-3">
                      {plan.excludes.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-400 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

