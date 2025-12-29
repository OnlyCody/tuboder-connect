import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

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
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">{t('board.title')}</h1>
        </div>
        
        {boardMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz yönetim kurulu üyesi bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {boardMembers.map((member) => {
              const name = language === 'tr' ? member.name_tr : language === 'en' ? member.name_en : member.name_bs;
              const position = language === 'tr' ? member.position_tr : language === 'en' ? member.position_en : member.position_bs;
              
              return (
                <Card key={member.id} className="rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8 text-center">
                    {member.photo_url && (
                      <Avatar className="h-20 w-20 mx-auto mb-4 border-2 border-primary/20">
                        <AvatarImage src={member.photo_url} />
                      </Avatar>
                    )}
                    <h3 className="text-xl font-bold text-foreground mb-2">{name}</h3>
                    <p className="text-primary">{position}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Board;