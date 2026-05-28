import { Users, Crown, Check, X, Loader2 } from 'lucide-react';
import { Plan, BillingCycle } from './types';
import { useTranslation } from '@/hooks/useTranslation';

interface PricingCardProps {
    plan: Plan;
    billingCycle: BillingCycle;
    isProcessing: boolean;
    onSelect: (plan: Plan) => void;
}

export function PricingCard({ plan, billingCycle, isProcessing, onSelect }: PricingCardProps) {
    const t = useTranslation();
    const displayPrice = billingCycle === 'anual' && plan.priceAnnual ? plan.priceAnnual : plan.price;

    return (
        <article className="w-full max-w-sm bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-[#83A98A] transition-all hover:shadow-2xl hover:shadow-[#83A98A]/20">
            {/* Header del plan */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                    {plan.isFree ? (
                        <p className="text-3xl font-bold text-white">{plan.price}</p>
                    ) : (
                        <div>
                            <span className="text-4xl font-bold text-white">
                                {displayPrice.includes('$') ? displayPrice : `$${displayPrice}`}
                            </span>
                            <span className="text-gray-400 ml-2">
                                {billingCycle === 'anual' ? t('pricing.perYear') : t('pricing.perMonth')}
                            </span>
                        </div>
                    )}
                </div>
                <p className="text-gray-300 text-sm">{plan.description}</p>
            </div>

            {/* Botones CTA - Single Button */}
            <div className="mt-8 mb-4">
                <button
                    onClick={() => onSelect(plan)}
                    disabled={isProcessing}
                    className={`w-full py-3.5 rounded-xl font-bold text-base shadow-lg transition-all ${isProcessing
                        ? 'bg-gray-600 cursor-not-allowed opacity-70'
                        : plan.isFree
                            ? 'bg-white text-gray-900 hover:bg-gray-100'
                            : 'bg-[#83A98A] text-white hover:bg-[#6e9175] hover:scale-[1.01]'
                        }`}
                >
                    {isProcessing ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" /> Procesando...
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            {plan.isFree ? <Users className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
                            {plan.buttonText}
                        </div>
                    )}
                </button>
                {!plan.isFree && (
                    <p className="text-center text-[10px] text-gray-400 mt-2">
                        Cancela cuando quieras. Pago seguro SSL.
                    </p>
                )}
            </div>

            {/* Incluye */}
            {plan.includes.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                        {t('pricing.includes')}
                    </h4>
                    <ul className="space-y-3">
                        {plan.includes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-[#83A98A] flex-shrink-0 mt-0.5" />
                                <span className="text-gray-300 text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* No incluye */}
            {plan.excludes.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">
                        {t('pricing.notIncludes')}
                    </h4>
                    <ul className="space-y-3">
                        {plan.excludes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                                <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-400 text-sm">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
}
