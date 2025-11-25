import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, Newspaper, Users, Calendar, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const sections = [
    {
      title: 'Carousel Yönetimi',
      description: 'Ana sayfadaki carousel içeriklerini düzenleyin',
      icon: Megaphone,
      path: '/admin/carousel',
      color: 'text-blue-500',
    },
    {
      title: 'Haberler',
      description: 'Haber ekleyin, düzenleyin ve yayınlayın',
      icon: Newspaper,
      path: '/admin/news',
      color: 'text-green-500',
    },
    {
      title: 'Yönetim Kurulu',
      description: 'Yönetim kurulu üyelerini yönetin',
      icon: Users,
      path: '/admin/board',
      color: 'text-purple-500',
    },
    {
      title: 'Etkinlikler',
      description: 'Etkinlikleri düzenleyin ve yayınlayın',
      icon: Calendar,
      path: '/admin/events',
      color: 'text-orange-500',
    },
    {
      title: 'Galeri',
      description: 'Fotoğraf galerisi yönetimi',
      icon: Image,
      path: '/admin/gallery',
      color: 'text-pink-500',
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
