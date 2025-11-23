import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const Membership = () => {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12">{t('nav.membership')}</h1>
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Info className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Üyelik Formu</CardTitle>
              <CardDescription className="text-center text-lg">
                Membership Form / Obrazac za Članstvo
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center py-8">
              <p className="text-lg text-muted-foreground">
                Üyelik formu yakında aktif olacaktır.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                The membership form will be active soon.
              </p>
              <p className="text-sm text-muted-foreground">
                Obrazac za članstvo će uskoro biti aktivan.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Membership;