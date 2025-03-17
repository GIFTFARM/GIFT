'use client';

import { useLanguage } from '../providers/LanguageProvider';
import { getTranslation, TranslationKey } from '../utils/translations';

export function useTranslation() {
  const { language } = useLanguage();

  const t = (key: TranslationKey): string => {
    return getTranslation(key, language);
  };

  return { t, language };
} 