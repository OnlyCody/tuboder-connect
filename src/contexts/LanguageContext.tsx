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
    'about.description': 'TUBODER, Türkiye ve Bosna Hersek iş dünyası arasında güçlü ve sürdürülebilir bir dayanışma ağı oluşturmayı hedefleyen bir sivil toplum kuruluşudur. Dernek, üyelerinin ticari faaliyetlerini destekleyerek, iş insanları arasında güven, iş birliği ve yeni fırsatlar yaratmayı amaçlar. Ayrıca toplumsal sorumluluk projeleri ve kültürel iş birlikleri ile iki ülke arasında sosyal ve ekonomik bağların güçlenmesine katkıda bulunur.',
    'about.vision.title': 'VİZYON',
    'about.vision.description': 'Türkiye ve Bosna Hersek arasındaki ticari, kültürel ve sosyal ilişkileri güçlendirerek iki ülke iş dünyasında sürdürülebilir iş birliği ve güvenilir ortaklıkların öncüsü olmak.',
    'about.mission.title': 'MİSYON',
    'about.mission.description': 'Üyelerimizin ticari faaliyetlerini desteklemek, iş insanları arasında dayanışmayı artırmak, yeni iş fırsatları oluşturmak ve iki ülke ekonomi ekosistemine değer katan projeler geliştirmek.',
    'about.projectsTitle': 'TUBODER PROJE ALANLARI',
    'about.projects.1.title': 'Ticari İş Birliği Projeleri',
    'about.projects.1.description': 'Türkiye ve Bosna Hersek\'teki iş insanlarını bir araya getiren toplantılar, iş forumları, B2B görüşmeleri ve sektörel ticaret heyetleri düzenlemek.',
    'about.projects.2.title': 'Yatırım ve Girişim Destek Projeleri',
    'about.projects.2.description': 'Her iki ülkede yatırım yapmak isteyen iş insanlarına danışmanlık, yönlendirme, fizibilite desteği ve iş ortamı analizi sağlamak.',
    'about.projects.3.title': 'Eğitim ve Kapasite Geliştirme Projeleri',
    'about.projects.3.description': 'İş dünyasına yönelik eğitim seminerleri, girişimcilik programları, genç iş insanlarına mentorluk destekleri ve sertifika programları düzenlemek.',
    'about.projects.4.title': 'Sosyal Sorumluluk ve Yardım Projeleri',
    'about.projects.4.description': 'Yetim ve ihtiyaç sahibi ailelere yönelik yardım kampanyaları, toplumsal dayanışma faaliyetleri ve kültürel projeleri yürütmek.',
    'about.projects.5.title': 'Kültürel ve Turizm İş Birliği Projeleri',
    'about.projects.5.description': 'Türkiye ve Bosna Hersek arasında kültürel etkinlikler, turizm tanıtım programları ve kardeş şehir ilişkilerini güçlendirmeye yönelik projeler gerçekleştirmek.',
    'about.projects.6.title': 'Üyeler Arası Dayanışma Projeleri',
    'about.projects.6.description': 'Üyelerin ticaretini kolaylaştıran ortak platformlar oluşturmak, sektör bazlı çalışma grupları kurmak ve dernek içi yardımlaşma mekanizmalarını güçlendirmek.',
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
    'about.description': 'TUBODER is a civil society organization that aims to establish a strong and sustainable solidarity network between the business world of Turkey and Bosnia and Herzegovina. The association aims to support the commercial activities of its members, creating trust, cooperation and new opportunities among business people. It also contributes to the strengthening of social and economic ties between the two countries through social responsibility projects and cultural collaborations.',
    'about.vision.title': 'VISION',
    'about.vision.description': 'To be the pioneer of sustainable cooperation and reliable partnerships in the business world of the two countries by strengthening commercial, cultural and social relations between Turkey and Bosnia and Herzegovina.',
    'about.mission.title': 'MISSION',
    'about.mission.description': 'To support the commercial activities of our members, increase solidarity among business people, create new business opportunities and develop projects that add value to the economic ecosystem of both countries.',
    'about.projectsTitle': 'TUBODER PROJECT AREAS',
    'about.projects.1.title': 'Commercial Cooperation Projects',
    'about.projects.1.description': 'Organizing meetings, business forums, B2B meetings and sectoral trade delegations that bring together business people in Turkey and Bosnia and Herzegovina.',
    'about.projects.2.title': 'Investment and Entrepreneurship Support Projects',
    'about.projects.2.description': 'Providing consultancy, guidance, feasibility support and business environment analysis to business people who want to invest in both countries.',
    'about.projects.3.title': 'Education and Capacity Building Projects',
    'about.projects.3.description': 'Organizing educational seminars for the business world, entrepreneurship programs, mentorship support for young business people and certificate programs.',
    'about.projects.4.title': 'Social Responsibility and Aid Projects',
    'about.projects.4.description': 'Conducting aid campaigns for orphans and families in need, social solidarity activities and cultural projects.',
    'about.projects.5.title': 'Cultural and Tourism Cooperation Projects',
    'about.projects.5.description': 'Implementing cultural events, tourism promotion programs and projects to strengthen sister city relations between Turkey and Bosnia and Herzegovina.',
    'about.projects.6.title': 'Mutual Solidarity Projects Among Members',
    'about.projects.6.description': 'Creating common platforms that facilitate the trade of members, establishing sector-based working groups and strengthening mutual assistance mechanisms within the association.',
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
    'about.description': 'TUBODER je nevladina organizacija koja ima za cilj uspostavljanje snažne i održive mreže solidarnosti između poslovnog svijeta Turske i Bosne i Hercegovine. Udruženje ima za cilj podržati komercijalne aktivnosti svojih članova, stvarajući povjerenje, saradnju i nove mogućnosti među poslovnim ljudima. Takođe doprinosi jačanju društvenih i ekonomskih veza između dve zemlje kroz projekte društvene odgovornosti i kulturne saradnje.',
    'about.vision.title': 'VIZIJA',
    'about.vision.description': 'Biti pionir održive saradnje i pouzdanih partnerstava u poslovnom svijetu dve zemlje jačanjem trgovinskih, kulturnih i društvenih odnosa između Turske i Bosne i Hercegovine.',
    'about.mission.title': 'MISIJA',
    'about.mission.description': 'Podržati komercijalne aktivnosti naših članova, povećati solidarnost među poslovnim ljudima, stvoriti nove poslovne prilike i razviti projekte koji dodaju vrednost ekonomskom ekosistemu obe zemlje.',
    'about.projectsTitle': 'TUBODER PROJEKTNA PODRUČJA',
    'about.projects.1.title': 'Projekti trgovinske saradnje',
    'about.projects.1.description': 'Organizovanje sastanaka, poslovnih foruma, B2B sastanaka i sektorskih trgovinskih delegacija koje okupljaju poslovne ljude u Turskoj i Bosni i Hercegovini.',
    'about.projects.2.title': 'Projekti podrške investicijama i preduzetništvu',
    'about.projects.2.description': 'Pružanje konsultantskih usluga, smernica, podrške izvodljivosti i analiza poslovnog okruženja poslovnim ljudima koji žele da investiraju u obe zemlje.',
    'about.projects.3.title': 'Projekti obrazovanja i izgradnje kapaciteta',
    'about.projects.3.description': 'Organizovanje obrazovnih seminara za poslovni svijet, programa preduzetništva, mentorske podrške za mlade poslovne ljude i programa sertifikacije.',
    'about.projects.4.title': 'Projekti društvene odgovornosti i pomoći',
    'about.projects.4.description': 'Sprovođenje kampanja pomoći za siročad i porodice u potrebi, aktivnosti društvene solidarnosti i kulturnih projekata.',
    'about.projects.5.title': 'Projekti kulturne i turističke saradnje',
    'about.projects.5.description': 'Sprovođenje kulturnih događaja, programa promocije turizma i projekata za jačanje odnosa između bratskih gradova između Turske i Bosne i Hercegovine.',
    'about.projects.6.title': 'Projekti uzajamne solidarnosti među članovima',
    'about.projects.6.description': 'Stvaranje zajedničkih platformi koje olakšavaju trgovinu članova, uspostavljanje radnih grupa zasnovanih na sektoru i jačanje mehanizama međusobne pomoći unutar udruženja.',
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