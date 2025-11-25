import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const News = () => {
  const { t } = useLanguage();

  // Placeholder news data - will be dynamic from database later
  const newsItems = [
    {
      id: 1,
      titleKey: 'news.item1.title',
      descriptionKey: 'news.item1.description',
      date: '2024-01-15',
    },
    {
      id: 2,
      titleKey: 'news.item2.title',
      descriptionKey: 'news.item2.description',
      date: '2024-01-10',
    },
    {
      id: 3,
      titleKey: 'news.item3.title',
      descriptionKey: 'news.item3.description',
      date: '2024-01-05',
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12">{t('news.title')}</h1>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {newsItems.map((news) => (
            <Card key={news.id} className="shadow-elegant hover:shadow-glow transition-all">
              <CardHeader>
                <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">{news.date}</span>
                </div>
                <CardTitle className="text-2xl">{t(news.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {t(news.descriptionKey)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default News;
