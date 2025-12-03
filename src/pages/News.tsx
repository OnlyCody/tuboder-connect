import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { transformGoogleDriveUrl } from '@/lib/utils';
import { useState } from 'react';

const News = () => {
  const { t, language } = useLanguage();
  const [selectedNews, setSelectedNews] = useState<any>(null);

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
              
              const content = language === 'tr' ? news.content_tr : language === 'en' ? news.content_en : news.content_bs;
              const hasLongContent = content && content.length > 150;
              
              return (
                <Card 
                  key={news.id} 
                  className="shadow-elegant hover:shadow-glow transition-all cursor-pointer"
                  onClick={() => setSelectedNews(news)}
                >
                  <div className="flex">
                    <div className="flex-1 p-6">
                      <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{format(new Date(news.published_date), 'dd.MM.yyyy')}</span>
                      </div>
                      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                      <p className="text-muted-foreground line-clamp-2">{description}</p>
                      {hasLongContent && (
                        <span className="text-primary font-medium mt-2 inline-block">
                          {language === 'tr' ? 'Devamını Oku...' : language === 'en' ? 'Read More...' : 'Pročitaj više...'}
                        </span>
                      )}
                    </div>
                    {news.image_url && (
                      <div className="w-40 h-40 flex-shrink-0 overflow-hidden rounded-r-lg">
                        <img src={transformGoogleDriveUrl(news.image_url)} alt={title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedNews && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {language === 'tr' ? selectedNews.title_tr : language === 'en' ? selectedNews.title_en : selectedNews.title_bs}
                </DialogTitle>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{format(new Date(selectedNews.published_date), 'dd.MM.yyyy')}</span>
                </div>
              </DialogHeader>
              {selectedNews.image_url && (
                <img 
                  src={transformGoogleDriveUrl(selectedNews.image_url)} 
                  alt={language === 'tr' ? selectedNews.title_tr : language === 'en' ? selectedNews.title_en : selectedNews.title_bs}
                  className="w-full aspect-video object-cover rounded-lg"
                />
              )}
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {language === 'tr' ? selectedNews.description_tr : language === 'en' ? selectedNews.description_en : selectedNews.description_bs}
                </p>
                {(language === 'tr' ? selectedNews.content_tr : language === 'en' ? selectedNews.content_en : selectedNews.content_bs) && (
                  <div className="prose prose-sm max-w-none">
                    <p>{language === 'tr' ? selectedNews.content_tr : language === 'en' ? selectedNews.content_en : selectedNews.content_bs}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default News;
