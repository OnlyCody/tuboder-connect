import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, Instagram } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';

// Instagram post ID'sini URL'den çıkaran fonksiyon
const extractInstagramPostId = (url: string): string | null => {
  if (!url) return null;
  // https://www.instagram.com/p/POST_ID/ veya https://www.instagram.com/reel/POST_ID/
  const match = url.match(/instagram\.com\/(?:p|reel)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
};

const InstagramEmbed = ({ url }: { url: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const postId = extractInstagramPostId(url);

  useEffect(() => {
    // Instagram embed script'ini yükle
    if (postId && typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      // Script yüklendikten sonra embed'i işle
      script.onload = () => {
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process();
        }
      };

      return () => {
        // Cleanup
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [postId]);

  if (!postId) {
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 transition-colors mt-3"
      >
        <Instagram className="h-5 w-5" />
        <span className="text-sm font-medium">Instagram'da Görüntüle</span>
      </a>
    );
  }

  return (
    <div ref={containerRef} className="mt-4">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '3px',
          boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
          margin: '1px',
          maxWidth: '540px',
          minWidth: '326px',
          padding: 0,
          width: '99.375%',
        }}
      >
        <div style={{ padding: '16px' }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700"
          >
            <Instagram className="h-5 w-5" />
            <span>Instagram'da Görüntüle</span>
          </a>
        </div>
      </blockquote>
    </div>
  );
};

const Events = () => {
  const { t, language } = useLanguage();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_published', true)
        .order('event_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">{t('events.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Henüz etkinlik bulunmamaktadır.</p>
            </div>
          ) : (
            events.map((event) => {
              const title = language === 'tr' ? event.title_tr : language === 'en' ? event.title_en : event.title_bs;
              const description = language === 'tr' ? event.description_tr : language === 'en' ? event.description_en : event.description_bs;
              const location = language === 'tr' ? event.location_tr : language === 'en' ? event.location_en : event.location_bs;
              
              // Instagram-only etkinlik - sadece embed göster
              if (event.is_instagram_only && event.instagram_url) {
                return (
                  <div key={event.id} className="w-full rounded-lg overflow-hidden bg-card shadow-elegant hover:shadow-glow hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                    <div className="h-[750px] overflow-hidden">
                      <InstagramEmbed url={event.instagram_url} />
                    </div>
                    <a 
                      href={event.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all border-t border-primary/20"
                    >
                      <Instagram className="h-5 w-5 text-primary" />
                      <span className="text-primary font-medium">Devamı için tıklayın</span>
                    </a>
                  </div>
                );
              }
              
              // Normal etkinlik
              return (
                <Card key={event.id} className="shadow-elegant hover:shadow-glow transition-shadow">
                  {event.image_url && (
                    <img src={event.image_url} alt={title} className="w-full h-48 object-cover rounded-t-lg" />
                  )}
                  <CardHeader>
                    <div className="flex items-center space-x-2 text-primary mb-2">
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm font-medium">{format(new Date(event.event_date), 'dd.MM.yyyy')}</span>
                    </div>
                    {location && (
                      <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{location}</span>
                      </div>
                    )}
                    <CardTitle className="text-xl">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{description}</CardDescription>
                    {event.instagram_url && (
                      <InstagramEmbed url={event.instagram_url} />
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;