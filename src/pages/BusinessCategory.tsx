import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Phone, MapPin, ArrowLeft, User } from 'lucide-react';

const BusinessCategory = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useLanguage();

  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['business-category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: businesses, isLoading: businessesLoading } = useQuery({
    queryKey: ['businesses-by-category', category?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_businesses')
        .select('*')
        .eq('category_id', category!.id)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
    enabled: !!category?.id,
  });

  const getCategoryName = (cat: any) => {
    switch (language) {
      case 'en':
        return cat.name_en;
      case 'bs':
        return cat.name_bs;
      default:
        return cat.name_tr;
    }
  };

  const isLoading = categoryLoading || businessesLoading;

  if (!categoryLoading && !category) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            {t('businesses.categoryNotFound')}
          </h1>
          <Link to="/businesses">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('businesses.backToCategories')}
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link to="/businesses">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('businesses.backToCategories')}
            </Button>
          </Link>
          
          {category && (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {getCategoryName(category)}
              </h1>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : businesses && businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {businesses.map((business) => (
              <Card key={business.id} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    {business.business_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{business.owner_name}</span>
                  </div>
                  {business.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${business.phone}`} className="hover:text-primary transition-colors">
                        {business.phone}
                      </a>
                    </div>
                  )}
                  {business.address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{business.address}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('businesses.noBusinesses')}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BusinessCategory;
