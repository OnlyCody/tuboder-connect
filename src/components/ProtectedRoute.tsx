import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if no user
  if (!user) {
    return <Navigate to="/yonetici-paneli" replace />;
  }

  // Show unauthorized page with login option if user lacks admin role
  if (requireAdmin && !isAdmin) {
    const handleGoToLogin = () => {
      window.location.href = '/yonetici-paneli';
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Yetkisiz Erişim</h1>
          <p className="text-muted-foreground">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
          <Button onClick={handleGoToLogin} className="mt-4">
            <LogIn className="h-4 w-4 mr-2" />
            Giriş Sayfasına Git
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
