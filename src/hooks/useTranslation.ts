import { useI18n } from '@/contexts/I18nContext';

/**
 * Hook para acceder a las traducciones
 * @param key - Clave de traducción usando notación de punto (ej: "hero.title")
 * @returns El texto traducido
 * 
 * @example
 * const t = useTranslation();
 * <h1>{t('hero.title')}</h1>
 */
export function useTranslation() {
  const { t } = useI18n();
  return t;
}

