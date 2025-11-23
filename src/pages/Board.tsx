import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Board = () => {
  const { t } = useLanguage();

  // Placeholder board members - will be managed from admin panel later
  const boardMembers = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      position: 'Başkan',
      image: null,
    },
    {
      id: 2,
      name: 'Mehmet Demir',
      position: 'Başkan Yardımcısı',
      image: null,
    },
    {
      id: 3,
      name: 'Ayşe Kaya',
      position: 'Genel Sekreter',
      image: null,
    },
  ];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">{t('board.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {boardMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden shadow-elegant hover:shadow-glow transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={member.image || undefined} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                  <p className="text-muted-foreground">{member.position}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Board;