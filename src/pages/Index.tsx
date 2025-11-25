import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Calendar, Users, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';

const Index = () => {
  const { t } = useLanguage();

  const carouselItems = [
    { titleKey: 'carousel.item1.title', descriptionKey: 'carousel.item1.description' },
    { titleKey: 'carousel.item2.title', descriptionKey: 'carousel.item2.description' },
    { titleKey: 'carousel.item3.title', descriptionKey: 'carousel.item3.description' },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-hero-gradient text-primary-foreground">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0wLTEwYzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTEwIDBjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90">
              {t('hero.subtitle')}
            </p>
            <Link to="/about">
              <Button size="lg" variant="secondary" className="group">
                {t('hero.cta')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="bg-secondary/20 py-8">
        <div className="container mx-auto px-4">
          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
              }),
            ]}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {carouselItems.map((item, index) => (
                <CarouselItem key={index}>
                  <Card className="shadow-elegant">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
                      <h3 className="text-3xl font-bold mb-4">{t(item.titleKey)}</h3>
                      <p className="text-lg text-muted-foreground">{t(item.descriptionKey)}</p>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">{t('about.title')}</h2>
            <Card className="shadow-elegant">
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed text-center">
                  {t('about.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Link to="/events" className="group">
              <Card className="h-full shadow-elegant hover:shadow-glow transition-all cursor-pointer">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{t('nav.events')}</CardTitle>
                  <CardDescription className="text-base">
                    Yaklaşan etkinliklerimizi keşfedin
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/board" className="group">
              <Card className="h-full shadow-elegant hover:shadow-glow transition-all cursor-pointer">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{t('board.title')}</CardTitle>
                  <CardDescription className="text-base">
                    Yönetim kadromuzla tanışın
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/gallery" className="group">
              <Card className="h-full shadow-elegant hover:shadow-glow transition-all cursor-pointer">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <ImageIcon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{t('nav.gallery')}</CardTitle>
                  <CardDescription className="text-base">
                    Anılarımızı görüntüleyin
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;