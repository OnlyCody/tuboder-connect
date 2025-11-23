import React, { createContext, useContext, useState } from 'react';

type Language = 'tr' | 'en' | 'bs';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  tr: {
    'nav.home': 'Ana Sayfa',
    'nav.about': 'Dernek Tanıtımı',
    'nav.board': 'Yönetim Kurulu',
    'nav.membership': 'Üyelik',
    'nav.events': 'Etkinlikler',
    'nav.gallery': 'Galeri',
    'hero.title': 'Türkiye Bosna Hersek İş Adamları Dayanışma Derneği',
    'hero.subtitle': 'İki kardeş ülke arasında güçlü iş bağları kuruyoruz',
    'hero.cta': 'Hakkımızda',
    'about.title': 'Derneğimiz Hakkında',
    'about.description': 'TUBODER, Türkiye ve Bosna Hersek arasında ticari, ekonomik ve kültürel ilişkilerin geliştirilmesi amacıyla kurulmuş bir iş adamları derneğidir.',
    'events.title': 'Son Etkinlikler',
    'events.viewAll': 'Tüm Etkinlikler',
    'board.title': 'Yönetim Kurulu',
    'footer.contact': 'İletişim',
    'footer.rights': 'Tüm hakları saklıdır.',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.board': 'Board of Directors',
    'nav.membership': 'Membership',
    'nav.events': 'Events',
    'nav.gallery': 'Gallery',
    'hero.title': 'Turkey Bosnia Herzegovina Business Association',
    'hero.subtitle': 'Building strong business ties between two brother nations',
    'hero.cta': 'About Us',
    'about.title': 'About Our Association',
    'about.description': 'TUBODER is a business association established to develop commercial, economic and cultural relations between Turkey and Bosnia Herzegovina.',
    'events.title': 'Recent Events',
    'events.viewAll': 'All Events',
    'board.title': 'Board of Directors',
    'footer.contact': 'Contact',
    'footer.rights': 'All rights reserved.',
  },
  bs: {
    'nav.home': 'Početna',
    'nav.about': 'O Nama',
    'nav.board': 'Upravni Odbor',
    'nav.membership': 'Članstvo',
    'nav.events': 'Događaji',
    'nav.gallery': 'Galerija',
    'hero.title': 'Udruženje Poslovnih Ljudi Turske i Bosne i Hercegovine',
    'hero.subtitle': 'Gradimo jake poslovne veze između dvije bratske nacije',
    'hero.cta': 'O Nama',
    'about.title': 'O Našem Udruženju',
    'about.description': 'TUBODER je poslovno udruženje osnovano radi razvoja trgovinskih, ekonomskih i kulturnih odnosa između Turske i Bosne i Hercegovine.',
    'events.title': 'Nedavni Događaji',
    'events.viewAll': 'Svi Događaji',
    'board.title': 'Upravni Odbor',
    'footer.contact': 'Kontakt',
    'footer.rights': 'Sva prava zadržana.',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('tr');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.tr] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};