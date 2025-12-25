import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Newspaper, Users, Calendar, Image, MapPin, FolderOpen, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const sections = [
    {
      title: 'Carousel Yönetimi',
      description: 'Ana sayfadaki carousel içeriklerini düzenleyin',
      icon: Megaphone,
      path: '/yonetici-paneli/carousel',
      color: 'text-blue-500',
    },
    {
      title: 'Bosna Hersek Tanıtım',
      description: 'Bosna Hersek tanıtım resimlerini yönetin',
      icon: MapPin,
      path: '/yonetici-paneli/bosnia-images',
      color: 'text-teal-500',
    },
    {
      title: 'Haberler',
      description: 'Haber ekleyin, düzenleyin ve yayınlayın',
      icon: Newspaper,
      path: '/yonetici-paneli/news',
      color: 'text-green-500',
    },
    {
      title: 'Yönetim Kurulu',
      description: 'Yönetim kurulu üyelerini yönetin',
      icon: Users,
      path: '/yonetici-paneli/board',
      color: 'text-purple-500',
    },
    {
      title: 'Etkinlikler',
      description: 'Etkinlikleri düzenleyin ve yayınlayın',
      icon: Calendar,
      path: '/yonetici-paneli/events',
      color: 'text-orange-500',
    },
    {
      title: 'Galeri',
      description: 'Fotoğraf galerisi yönetimi',
      icon: Image,
      path: '/yonetici-paneli/gallery',
      color: 'text-pink-500',
    },
    {
      title: 'İşyeri Kategorileri',
      description: 'Üye işyeri kategorilerini yönetin',
      icon: FolderOpen,
      path: '/yonetici-paneli/categories',
      color: 'text-amber-500',
    },
    {
      title: 'Üye İşyerleri',
      description: 'Üye işyerlerini ekleyin ve düzenleyin',
      icon: Store,
      path: '/yonetici-paneli/businesses',
      color: 'text-red-500',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Yönetim Paneli</h1>
          <p className="text-muted-foreground">
            TUBODER içerik yönetim sistemine hoş geldiniz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.path} to={section.path}>
                <Card className="h-full hover:shadow-glow transition-all cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4 ${section.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
