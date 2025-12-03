import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, Instagram } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-primary mb-4">TUBODER</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t('hero.subtitle')}
            </p>
            <a 
              href="https://www.instagram.com/tuboder2025/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@tuboder.org</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+38761233995</span>
              </div>
              <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Safvet-bega Bašagića 27<br />Sarajevo 71000</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('nav.events')}</h4>
            <p className="text-sm text-muted-foreground">
              {t('about.description')}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 TUBODER. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;