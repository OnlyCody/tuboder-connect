import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
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

  // Group members by position
  const groupedMembers = boardMembers.reduce((acc, member) => {
    const position = language === 'tr' ? member.position_tr : language === 'en' ? member.position_en : member.position_bs;
    if (!acc[position]) {
      acc[position] = [];
    }
    acc[position].push(member);
    return acc;
  }, {} as Record<string, typeof boardMembers>);

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
        
        {boardMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Henüz yönetim kurulu üyesi bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-10">
            {Object.entries(groupedMembers).map(([position, members]) => (
              <div key={position} className="text-center">
                <h2 className="text-xl font-semibold text-primary mb-4">{position}</h2>
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                  {members.map((member) => {
                    const name = language === 'tr' ? member.name_tr : language === 'en' ? member.name_en : member.name_bs;
                    
                    return (
                      <div key={member.id} className="flex items-center gap-3">
                        {member.photo_url && (
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.photo_url} />
                          </Avatar>
                        )}
                        <span className="text-foreground font-medium">{name}</span>
                      </div>
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