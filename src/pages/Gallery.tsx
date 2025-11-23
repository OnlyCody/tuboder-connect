import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, Video } from 'lucide-react';

const Gallery = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">{t('nav.gallery')}</h1>
        
        <Tabs defaultValue="photos" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="photos" className="flex items-center space-x-2">
              <Image className="h-4 w-4" />
              <span>Fotoğraflar</span>
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center space-x-2">
              <Video className="h-4 w-4" />
              <span>Videolar</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="photos" className="mt-8">
            <div className="text-center py-16">
              <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Image className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground">
                Fotoğraf galerisi yakında eklenecektir
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="videos" className="mt-8">
            <div className="text-center py-16">
              <div className="bg-muted rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Video className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-lg text-muted-foreground">
                Video galerisi yakında eklenecektir
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Gallery;