import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Henüz etkinlik bulunmamaktadır.</p>
            </div>
          ) : (
            events.map((event) => {
              const title = language === 'tr' ? event.title_tr : language === 'en' ? event.title_en : event.title_bs;
              const description = language === 'tr' ? event.description_tr : language === 'en' ? event.description_en : event.description_bs;
              const location = language === 'tr' ? event.location_tr : language === 'en' ? event.location_en : event.location_bs;
              
              return (
                <Card key={event.id} className="shadow-elegant hover:shadow-glow transition-shadow cursor-pointer">
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