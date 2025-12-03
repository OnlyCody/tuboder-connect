import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const Membership = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">{t('nav.membership')}</h1>
        <div className="max-w-4xl mx-auto">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSdW9U4t0bL3td8JsT4Bhyn2vt-ultu6vskqlpOQae6GFQxcoA/viewform?embedded=true"
            width="100%"
            height="1200"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            className="rounded-lg shadow-elegant"
          >
            Yükleniyor…
          </iframe>
        </div>
      </div>
    </MainLayout>
  );
};

export default Membership;