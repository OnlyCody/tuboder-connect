import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Gallery = () => {
  const { t, language } = useLanguage();

  const { data: galleryItems = [], isLoading } = useQuery({
    queryKey: ['gallery-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      
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
        <h1 className="text-4xl font-bold text-center mb-12">{t('nav.gallery')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {galleryItems.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Image className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground">
                Henüz galeri öğesi bulunmamaktadır.
              </p>
            </div>
          ) : (
            galleryItems.map((item) => {
              const title = language === 'tr' ? item.title_tr : language === 'en' ? item.title_en : item.title_bs;
              const description = language === 'tr' ? item.description_tr : language === 'en' ? item.description_en : item.description_bs;
              const album = language === 'tr' ? item.album_tr : language === 'en' ? item.album_en : item.album_bs;
              
              return (
                <Card key={item.id} className="overflow-hidden shadow-elegant hover:shadow-glow transition-shadow cursor-pointer">
                  <img src={item.image_url} alt={title} className="w-full h-64 object-cover" />
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{title}</h3>
                    {album && <p className="text-sm text-muted-foreground mb-1">{album}</p>}
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
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

export default Gallery;