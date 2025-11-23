import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

const Events = () => {
  const { t } = useLanguage();

  // Placeholder events - will be managed from admin panel later
  const events = [
    {
      id: 1,
      title: 'İş Dünyası Buluşması',
      date: '15 Mart 2025',
      description: 'Türk ve Bosnalı iş adamlarının bir araya geldiği networking etkinliği.',
    },
    {
      id: 2,
      title: 'Yatırım Fırsatları Semineri',
      date: '22 Nisan 2025',
      description: 'Bosna Hersek\'teki yatırım fırsatları hakkında bilgilendirme semineri.',
    },
    {
      id: 3,
      title: 'Kültür Gecesi',
      date: '10 Mayıs 2025',
      description: 'İki kardeş ülkenin kültürlerini paylaştığı özel gece.',
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">{t('events.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map((event) => (
            <Card key={event.id} className="shadow-elegant hover:shadow-glow transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-2 text-primary mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm font-medium">{event.date}</span>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{event.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Events;