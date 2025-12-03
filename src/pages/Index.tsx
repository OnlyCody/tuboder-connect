import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Calendar, Users, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformGoogleDriveUrl } from '@/lib/utils';

// Bosna Hersek tanıtım resimleri
const bosniaImages = [
  {
    url: 'https://images.unsplash.com/photo-1555990538-1e6c0c5e0c5c?w=800&h=600&fit=crop',
    title_tr: 'Saraybosna',
    title_en: 'Sarajevo',
    title_bs: 'Sarajevo'
  },
  {
    url: 'https://images.unsplash.com/photo-1592425027738-4caa5a05d8cd?w=800&h=600&fit=crop',
    title_tr: 'Mostar Köprüsü',
    title_en: 'Mostar Bridge',
    title_bs: 'Stari Most'
  },
  {
    url: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&h=600&fit=crop',
    title_tr: 'Bosna Nehri',
    title_en: 'Bosnia River',
    title_bs: 'Rijeka Bosna'
  },
  {
    url: 'https://images.unsplash.com/photo-1586253633445-b04e945e0c2f?w=800&h=600&fit=crop',
    title_tr: 'Tarihi Çarşı',
    title_en: 'Historic Bazaar',
    title_bs: 'Baščaršija'
  }
];

const Index = () => {
  const { t, language } = useLanguage();

  const { data: carouselItems = [] } = useQuery({
    queryKey: ['carousel-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: latestNews = [] } = useQuery({
    queryKey: ['latest-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data || [];
    },
  });

  const getBosniaTitle = (item: typeof bosniaImages[0]) => {
    return language === 'tr' ? item.title_tr : language === 'en' ? item.title_en : item.title_bs;
  };

  const getNewsTitle = (item: any) => {
    return language === 'tr' ? item.title_tr : language === 'en' ? item.title_en : item.title_bs;
  };

  const getNewsDescription = (item: any) => {
    return language === 'tr' ? item.description_tr : language === 'en' ? item.description_en : item.description_bs;
  };

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

      {/* Three Column Section */}
      <section className="bg-secondary/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Bosna Hersek Tanıtımı */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center text-primary">
                {language === 'tr' ? 'Bosna Hersek' : language === 'en' ? 'Bosnia Herzegovina' : 'Bosna i Hercegovina'}
              </h3>
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 7000,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent>
                  {bosniaImages.map((item, index) => (
                    <CarouselItem key={index}>
                      <Card className="shadow-elegant overflow-hidden">
                        <CardContent className="p-0 relative">
                          <img 
                            src={item.url} 
                            alt={getBosniaTitle(item)} 
                            className="w-full aspect-[4/3] object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <p className="text-white font-semibold text-lg">{getBosniaTitle(item)}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>

            {/* 2. Son Haberler */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center text-primary">
                {language === 'tr' ? 'Son Haberler' : language === 'en' ? 'Latest News' : 'Najnovije Vijesti'}
              </h3>
              <div className="space-y-3">
                {latestNews.length > 0 ? (
                  latestNews.map((news) => (
                    <Link to="/news" key={news.id}>
                      <Card className="shadow-elegant hover:shadow-glow transition-all cursor-pointer">
                        <CardContent className="p-3">
                          <div className="flex gap-3">
                            {news.image_url && (
                              <img 
                                src={transformGoogleDriveUrl(news.image_url)} 
                                alt={getNewsTitle(news)} 
                                className="w-16 h-16 object-cover rounded flex-shrink-0"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm line-clamp-2">{getNewsTitle(news)}</h4>
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{getNewsDescription(news)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <Card className="shadow-elegant">
                    <CardContent className="p-6 text-center text-muted-foreground">
                      {language === 'tr' ? 'Henüz haber yok' : language === 'en' ? 'No news yet' : 'Nema vijesti'}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* 3. Reklamlar */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center text-primary">
                {language === 'tr' ? 'Reklamlar' : language === 'en' ? 'Advertisements' : 'Reklame'}
              </h3>
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 5000,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent>
                  {carouselItems.length > 0 ? (
                    carouselItems.map((item) => {
                      const title = language === 'tr' ? item.title_tr : language === 'en' ? item.title_en : item.title_bs;
                      const description = language === 'tr' ? item.description_tr : language === 'en' ? item.description_en : item.description_bs;
                      
                      return (
                        <CarouselItem key={item.id}>
                          <Card className="shadow-elegant overflow-hidden">
                            <CardContent className="p-0">
                              {item.image_url && (
                                <img 
                                  src={transformGoogleDriveUrl(item.image_url)} 
                                  alt={title} 
                                  className="w-full aspect-square object-cover"
                                />
                              )}
                              <div className="p-4">
                                <h4 className="font-bold text-sm mb-1 line-clamp-1">{title}</h4>
                                <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      );
                    })
                  ) : (
                    <CarouselItem>
                      <Card className="shadow-elegant">
                        <CardContent className="p-6 aspect-square flex items-center justify-center text-muted-foreground text-center">
                          {language === 'tr' ? 'Bu alana reklam verebilirsiniz' : language === 'en' ? 'You can advertise here' : 'Možete oglašavati ovdje'}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )}
                </CarouselContent>
              </Carousel>
            </div>

          </div>
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
