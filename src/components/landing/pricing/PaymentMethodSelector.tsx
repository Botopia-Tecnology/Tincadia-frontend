import React from 'react';
import Image from 'next/image';
import { Lock, CreditCard, PiggyBank, ChevronRight, X, Info } from 'lucide-react';

interface PaymentMethodSelectorProps {
    onClose: () => void;
    onSelectCredit: () => void;
    onSelectDebit: () => void;
}

export function PaymentMethodSelector({ onClose, onSelectCredit, onSelectDebit }: PaymentMethodSelectorProps) {
    return (
        <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 font-sans">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
                <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
                <div className="inline-flex p-3 rounded-full bg-red-50 text-red-500 mb-4 ring-1 ring-red-100">
                    <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Añade un método de pago</h3>
                <p className="text-sm text-gray-500 mt-3 max-w-xs mx-auto leading-relaxed">
                    Configura tu tarjeta para asegurar la activación inmediata y la renovación automática de tu plan Premium.
                </p>
            </div>

            <div className="space-y-4">
                {/* Credit Card Option */}
                <button
                    onClick={onSelectCredit}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-[#83A98A] hover:bg-gray-50/50 transition-all group active:scale-[0.99]"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:text-[#83A98A]">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <span className="block font-semibold text-gray-900 group-hover:text-[#83A98A]">Tarjeta de Crédito</span>
                            <div className="flex gap-2 mt-1.5 opacity-80">
                                <Image src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520243/VISA-Logo_zhllqu.png" alt="Visa" width={30} height={20} className="h-5 w-auto object-contain" unoptimized />
                                <Image src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520242/mastercard-logo_kecgyl.png" alt="Mastercard" width={30} height={20} className="h-5 w-auto object-contain" unoptimized />
                                <Image src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520242/american-logo_muhxps.png" alt="Amex" width={30} height={20} className="h-5 w-auto object-contain" unoptimized />
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-[#83A98A] w-5 h-5" />
                </button>

                {/* Debit Card Option */}
                <button
                    onClick={onSelectDebit}
                    className="w-full border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-[#83A98A] hover:bg-gray-50/50 transition-all group active:scale-[0.99]"
                >
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:text-[#83A98A]">
                            <PiggyBank className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <span className="block font-semibold text-gray-900 group-hover:text-[#83A98A]">Tarjeta Débito / Ahorros</span>
                            <div className="flex gap-2 mt-1.5 opacity-80">
                                <Image src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520243/VISA-Logo_zhllqu.png" alt="Visa" width={30} height={20} className="h-5 w-auto object-contain" unoptimized />
                                <Image src="https://res.cloudinary.com/do1mvhvms/image/upload/v1768520242/mastercard-logo_kecgyl.png" alt="Mastercard" width={30} height={20} className="h-5 w-auto object-contain" unoptimized />
                            </div>
                        </div>
                    </div>
                    <ChevronRight className="text-gray-300 group-hover:text-[#83A98A] w-5 h-5" />
                </button>
            </div>

            <div className="mt-8 text-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p className="text-[11px] text-gray-500 flex items-start justify-center gap-2 text-left">
                    <Info className="w-3 h-3 flex-shrink-0 mt-0.5 text-blue-500" />
                    <span>
                        Este es el <strong>único método de pago habilitado</strong> para suscripciones recurrentes.
                        Tus datos son procesados de forma segura con cifrado bancario.
                    </span>
                </p>
            </div>

            <div className="mt-6 flex justify-center">
                <p className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Cifrado de extremo a extremo
                </p>
            </div>
        </div>
    );
}
