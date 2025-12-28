import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  ChevronRight, 
  UtensilsCrossed, 
  Car, 
  Shirt, 
  Apple, 
  Heart, 
  Hammer, 
  Briefcase, 
  GraduationCap, 
  ShoppingBag, 
  Palette,
  Scissors,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  Shirt,
  Apple,
  Heart,
  Hammer,
  Briefcase,
  GraduationCap,
  ShoppingBag,
  Palette,
  Building2,
  Scissors,
};

const getIcon = (iconName: string | null): LucideIcon => {
  if (iconName && iconMap[iconName]) {
    return iconMap[iconName];
  }
  return Building2;
};

const Businesses = () => {
  const { language, t } = useLanguage();

  const { data: categories, isLoading } = useQuery({
    queryKey: ['business-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const getCategoryName = (category: any) => {
    switch (language) {
      case 'en':
        return category.name_en;
      case 'bs':
        return category.name_bs;
      default:
        return category.name_tr;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {t('businesses.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('businesses.description')}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : categories && categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} to={`/businesses/${category.slug}`}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {(() => {
                      const IconComponent = getIcon(category.icon);
                      return (
                        <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <IconComponent className="h-8 w-8 text-primary" />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {getCategoryName(category)}
                      </CardTitle>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('businesses.noCategories')}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Businesses;
