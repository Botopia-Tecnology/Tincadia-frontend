'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Building2, MessageSquare } from 'lucide-react';

interface ServiceCategory {
  title: string;
  items: {
    name: string;
    description: string;
    href: string;
    icon: React.ReactNode;
    iconColor: string;
  }[];
}

const serviceCategories: ServiceCategory[] = [
  {
    title: 'Encuentra trabajo',
    items: [
      {
        name: 'Encontrar una empresa inclusiva',
        description: 'Conecta con empresas comprometidas con la inclusión',
        href: '#empresas-inclusivas',
        icon: <Building2 className="w-6 h-6" />,
        iconColor: 'bg-blue-100 text-blue-600',
      },
      {
        name: 'Convertirte en un intérprete',
        description: 'Únete a nuestra red de intérpretes profesionales',
        href: '#ser-interprete',
        icon: <MessageSquare className="w-6 h-6" />,
        iconColor: 'bg-purple-100 text-purple-600',
      },
    ],
  },
  // Se pueden agregar más categorías aquí en el futuro
];

export function ServicesDropdown() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const toggleCategory = (title: string) => {
    setOpenCategory(openCategory === title ? null : title);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {serviceCategories.map((category) => (
        <div key={category.title} className="mb-6">
          {/* Botón de categoría */}
          <button
            type="button"
            onClick={() => toggleCategory(category.title)}
            className="w-full flex items-center justify-between p-5 bg-white rounded-xl border border-gray-200 hover:border-[#83A98A] hover:shadow-lg transition-all text-left group"
            aria-expanded={openCategory === category.title}
            aria-controls={`category-${category.title}`}
          >
            <span className="text-xl font-bold text-gray-900 group-hover:text-[#83A98A] transition-colors">
              {category.title}
            </span>
            <ChevronDown
              className={`w-6 h-6 text-gray-500 transition-transform duration-200 ${
                openCategory === category.title ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {/* Contenido desplegable */}
          {openCategory === category.title && (
            <div
              id={`category-${category.title}`}
              className="mt-3 bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden animate-in slide-in-from-top-2 duration-200"
            >
              <div className="p-6 space-y-4">
                {category.items.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all group/item border border-transparent hover:border-gray-200"
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${item.iconColor} transition-transform group-hover/item:scale-110`}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 mb-1.5 group-hover/item:text-[#83A98A] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

