import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { transformGoogleDriveUrl } from '@/lib/utils';

const News = () => {
  const { t, language } = useLanguage();

  const { data: newsItems = [], isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('is_published', true)
        .order('published_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
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
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">{t('news.title')}</h1>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {newsItems.length === 0 ? (
            <Card className="shadow-elegant">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Henüz haber bulunmamaktadır.</p>
              </CardContent>
            </Card>
          ) : (
            newsItems.map((news) => {
              const title = language === 'tr' ? news.title_tr : language === 'en' ? news.title_en : news.title_bs;
              const description = language === 'tr' ? news.description_tr : language === 'en' ? news.description_en : news.description_bs;
              
              return (
                <Card key={news.id} className="shadow-elegant hover:shadow-glow transition-all">
                  {news.image_url && (
                    <div className="w-full aspect-square overflow-hidden rounded-t-lg">
                      <img src={transformGoogleDriveUrl(news.image_url)} alt={title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{format(new Date(news.published_date), 'dd.MM.yyyy')}</span>
                    </div>
                    <CardTitle className="text-2xl">{title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {description}
                    </CardDescription>
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

export default News;
