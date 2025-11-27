import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Board from "./pages/Board";
import Membership from "./pages/Membership";
import Events from "./pages/Events";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import AdminPanel from "./pages/AdminPanel";
import AdminCarousel from "./pages/admin/AdminCarousel";
import AdminNews from "./pages/admin/AdminNews";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/board" element={<Board />} />
              <Route path="/membership" element={<Membership />} />
              <Route path="/events" element={<Events />} />
              <Route path="/news" element={<News />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/yonetici-paneli" element={<AdminPanel />} />
              <Route 
                path="/yonetici-paneli/carousel" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCarousel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/yonetici-paneli/news" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminNews />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
