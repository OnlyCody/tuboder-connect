import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { ArrowRight, Calendar, Users, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { transformGoogleDriveUrl } from '@/lib/utils';
import tuboderMainLogo from '@/assets/tuboder-main-logo.png';
import openingInvitation from '@/assets/opening-invitation.jpeg';


const Index = () => {
  const { t, language } = useLanguage();

  const { data: bosniaImages = [] } = useQuery({
    queryKey: ['bosnia-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bosnia_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
      if (error) throw error;
      return data || [];
    },
  });

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

  const getBosniaTitle = (item: any) => {
    return language === 'tr' ? item.title_tr : language === 'en' ? item.title_en : item.title_bs;
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

      {/* Main Content Section - Davetiye + 3 Sütun */}
      <section className="py-8 bg-gradient-to-r from-primary/5 via-secondary/10 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Sol: Açılış Davetiyesi - Geçici, açılıştan sonra kaldırılacak */}
            <div>
              <Card className="shadow-elegant overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors h-full">
                <CardContent className="p-0 h-full flex items-center justify-center">
                  <img 
                    src={openingInvitation}
                    alt="TUBODER Açılış Davetiyesi" 
                    className="w-full h-auto object-contain"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sağ: Bosna Hersek, Dernek Logosu, Reklamlar */}
            <div className="space-y-6">
              
              {/* 1. Bosna Hersek Tanıtımı */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-center text-primary">
                  {language === 'tr' ? 'Bosna Hersek' : language === 'en' ? 'Bosnia Herzegovina' : 'Bosna i Hercegovina'}
                </h3>
                {bosniaImages.length > 0 ? (
                  <Carousel
                    opts={{
                      align: 'start',
                      loop: true,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 3500,
                      }),
                    ]}
                    className="w-full"
                  >
                    <CarouselContent>
                      {bosniaImages.map((item) => (
                        <CarouselItem key={item.id}>
                          <Card className="shadow-elegant overflow-hidden">
                            <CardContent className="p-0 relative">
                              <img 
                                src={transformGoogleDriveUrl(item.image_url)} 
                                alt={getBosniaTitle(item)} 
                                className="w-full aspect-video object-cover"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                                <p className="text-white font-semibold text-base">{getBosniaTitle(item)}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                ) : (
                  <Card className="shadow-elegant">
                    <CardContent className="p-4 aspect-video flex items-center justify-center text-muted-foreground text-center">
                      {language === 'tr' ? 'Resim eklenmemiş' : language === 'en' ? 'No images added' : 'Nema slika'}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* 2. Dernek Logosu ve Reklamlar - Yan yana */}
              <div className="grid grid-cols-2 gap-4">
                {/* Dernek Logosu */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-center text-primary">
                    {language === 'tr' ? 'Dernek Logosu' : language === 'en' ? 'Association Logo' : 'Logo Udruženja'}
                  </h3>
                  <Card className="shadow-elegant overflow-hidden">
                    <CardContent className="p-0 aspect-square flex items-center justify-center bg-white">
                      <img 
                        src={tuboderMainLogo}
                        alt="TUBODER Logo" 
                        className="w-3/4 h-auto object-contain"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Reklamlar */}
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-center text-primary">
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
                                </CardContent>
                              </Card>
                            </CarouselItem>
                          );
                        })
                      ) : (
                        <CarouselItem>
                          <Card className="shadow-elegant">
                            <CardContent className="p-4 aspect-square flex items-center justify-center text-muted-foreground text-center text-xs">
                              {language === 'tr' ? 'Reklam alanı' : language === 'en' ? 'Ad space' : 'Prostor za oglase'}
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      )}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>

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

            <Link to="/businesses" className="group">
              <Card className="h-full shadow-elegant hover:shadow-glow transition-all cursor-pointer">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                    <Store className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">{t('nav.businesses')}</CardTitle>
                  <CardDescription className="text-base">
                    {language === 'tr' ? 'Üye işyerlerimizi keşfedin' : language === 'en' ? 'Discover our member businesses' : 'Otkrijte naše članove'}
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
