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

  // Group members by position (using Turkish as key for consistent grouping)
  const groupedMembers = boardMembers.reduce((acc, member) => {
    const positionKey = member.position_tr; // Use Turkish for consistent grouping
    if (!acc[positionKey]) {
      acc[positionKey] = {
        position_tr: member.position_tr,
        position_bs: member.position_bs,
        members: []
      };
    }
    acc[positionKey].members.push(member);
    return acc;
  }, {} as Record<string, { position_tr: string; position_bs: string; members: typeof boardMembers }>);

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
          <div className="max-w-4xl mx-auto space-y-10">
            {Object.entries(groupedMembers).map(([positionKey, group]) => (
              <div key={positionKey}>
                <h2 className="text-xl font-semibold text-primary text-center mb-6">
                  {group.position_tr} / {group.position_bs}
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                  {group.members.map((member) => {
                    const name = language === 'tr' ? member.name_tr : language === 'en' ? member.name_en : member.name_bs;
                    
                    return (
                      <Card key={member.id} className="w-full md:w-[calc(50%-0.5rem)] max-w-sm rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6 text-center">
                          {member.photo_url && (
                            <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-primary/20">
                              <AvatarImage src={member.photo_url} />
                            </Avatar>
                          )}
                          <h3 className="text-lg font-bold text-foreground">{name}</h3>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Board;