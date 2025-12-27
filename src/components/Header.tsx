import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { user, isAdmin } = useAuth();

  const languages = [
    { code: 'tr', name: 'Türkçe' },
    { code: 'en', name: 'English' },
    { code: 'bs', name: 'Bosanski' },
  ];

  const navItems = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'board', path: '/board' },
    { key: 'membership', path: '/membership' },
    { key: 'businesses', path: '/businesses' },
    { key: 'events', path: '/events' },
    { key: 'news', path: '/news' },
    { key: 'gallery', path: '/gallery' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex flex-col">
            <div className="text-2xl font-bold text-primary leading-tight">TUBODER</div>
            <div className="text-[10px] text-muted-foreground tracking-wide">Birlikte Daha Güçlüyüz</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Admin Button */}
            {user && isAdmin && (
              <Link to="/yonetici-paneli">
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Yönetim Paneli
                </Button>
              </Link>
            )}
            
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as 'tr' | 'en' | 'bs')}
                    className={language === lang.code ? 'bg-secondary' : ''}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.key}
                to={item.path}
                className="block py-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;