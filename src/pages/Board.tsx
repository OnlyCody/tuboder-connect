import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Board = () => {
  const { t, language } = useLanguage();

  const { data: boardMembers = [], isLoading } = useQuery({
    queryKey: ['board-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('board_members')
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
        <h1 className="text-4xl font-bold text-center mb-12">{t('board.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {boardMembers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Henüz yönetim kurulu üyesi bulunmamaktadır.</p>
            </div>
          ) : (
            boardMembers.map((member) => {
              const name = language === 'tr' ? member.name_tr : language === 'en' ? member.name_en : member.name_bs;
              const position = language === 'tr' ? member.position_tr : language === 'en' ? member.position_en : member.position_bs;
              const bio = language === 'tr' ? member.bio_tr : language === 'en' ? member.bio_en : member.bio_bs;
              
              return (
                <Card key={member.id} className="overflow-hidden shadow-elegant hover:shadow-glow transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-32 w-32 mb-4">
                        <AvatarImage src={member.photo_url || undefined} />
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold mb-2">{name}</h3>
                      <p className="text-muted-foreground mb-3">{position}</p>
                      {bio && <p className="text-sm text-muted-foreground">{bio}</p>}
                    </div>
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

export default Board;