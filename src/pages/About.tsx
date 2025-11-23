import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">{t('about.title')}</h1>
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg shadow-elegant p-8 space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {t('about.description')}
            </p>
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-semibold text-primary mt-6 mb-4">Misyonumuz</h2>
              <p className="text-muted-foreground">
                Türkiye ve Bosna Hersek arasında ticari, ekonomik ve kültürel köprüler kurmak.
              </p>
              
              <h2 className="text-2xl font-semibold text-primary mt-6 mb-4">Vizyonumuz</h2>
              <p className="text-muted-foreground">
                İki ülke arasında güçlü iş birliktelikleri oluşturarak bölgesel kalkınmaya katkı sağlamak.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;