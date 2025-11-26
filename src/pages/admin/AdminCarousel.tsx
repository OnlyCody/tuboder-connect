import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { z } from 'zod';

const carouselSchema = z.object({
  title_tr: z.string().min(1, 'Türkçe başlık gereklidir').max(200),
  title_en: z.string().min(1, 'İngilizce başlık gereklidir').max(200),
  title_bs: z.string().min(1, 'Boşnakça başlık gereklidir').max(200),
  description_tr: z.string().min(1, 'Türkçe açıklama gereklidir').max(500),
  description_en: z.string().min(1, 'İngilizce açıklama gereklidir').max(500),
  description_bs: z.string().min(1, 'Boşnakça açıklama gereklidir').max(500),
  image_url: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type CarouselFormData = z.infer<typeof carouselSchema>;

const AdminCarousel = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CarouselFormData>({
    title_tr: '',
    title_en: '',
    title_bs: '',
    description_tr: '',
    description_en: '',
    description_bs: '',
    image_url: '',
    display_order: 0,
    is_active: true,
  });

  const { data: carouselItems, isLoading } = useQuery({
    queryKey: ['admin-carousel'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('carousel_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: CarouselFormData) => {
      const insertData = {
        title_tr: data.title_tr,
        title_en: data.title_en,
        title_bs: data.title_bs,
        description_tr: data.description_tr,
        description_en: data.description_en,
        description_bs: data.description_bs,
        image_url: data.image_url || null,
        display_order: data.display_order,
        is_active: data.is_active,
      };
      
      const { error } = await supabase
        .from('carousel_items')
        .insert([insertData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-carousel'] });
      toast({ title: 'Başarılı', description: 'Carousel öğesi oluşturuldu' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Hata', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CarouselFormData }) => {
      const updateData = {
        title_tr: data.title_tr,
        title_en: data.title_en,
        title_bs: data.title_bs,
        description_tr: data.description_tr,
        description_en: data.description_en,
        description_bs: data.description_bs,
        image_url: data.image_url || null,
        display_order: data.display_order,
        is_active: data.is_active,
      };
      
      const { error } = await supabase
        .from('carousel_items')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-carousel'] });
      toast({ title: 'Başarılı', description: 'Carousel öğesi güncellendi' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Hata', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('carousel_items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-carousel'] });
      toast({ title: 'Başarılı', description: 'Carousel öğesi silindi' });
    },
    onError: (error) => {
      toast({ title: 'Hata', description: error.message, variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validatedData = carouselSchema.parse(formData);
      
      if (editingId) {
        updateMutation.mutate({ id: editingId, data: validatedData });
      } else {
        createMutation.mutate(validatedData);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Doğrulama Hatası',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setFormData({
      title_tr: item.title_tr,
      title_en: item.title_en,
      title_bs: item.title_bs,
      description_tr: item.description_tr,
      description_en: item.description_en,
      description_bs: item.description_bs,
      image_url: item.image_url || '',
      display_order: item.display_order,
      is_active: item.is_active,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title_tr: '',
      title_en: '',
      title_bs: '',
      description_tr: '',
      description_en: '',
      description_bs: '',
      image_url: '',
      display_order: 0,
      is_active: true,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Carousel Yönetimi</h1>
            <p className="text-muted-foreground">Ana sayfa slider içeriklerini yönetin</p>
          </div>
          {!isFormOpen && (
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ekle
            </Button>
          )}
        </div>

        {isFormOpen && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{editingId ? 'Carousel Öğesini Düzenle' : 'Yeni Carousel Öğesi'}</CardTitle>
                  <CardDescription>3 dilde içerik girin</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="tr" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="tr">Türkçe</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="bs">Bosanski</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tr" className="space-y-4">
                    <div>
                      <Label htmlFor="title_tr">Başlık (TR)</Label>
                      <Input
                        id="title_tr"
                        value={formData.title_tr}
                        onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_tr">Açıklama (TR)</Label>
                      <Textarea
                        id="description_tr"
                        value={formData.description_tr}
                        onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="en" className="space-y-4">
                    <div>
                      <Label htmlFor="title_en">Title (EN)</Label>
                      <Input
                        id="title_en"
                        value={formData.title_en}
                        onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_en">Description (EN)</Label>
                      <Textarea
                        id="description_en"
                        value={formData.description_en}
                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="bs" className="space-y-4">
                    <div>
                      <Label htmlFor="title_bs">Naslov (BS)</Label>
                      <Input
                        id="title_bs"
                        value={formData.title_bs}
                        onChange={(e) => setFormData({ ...formData, title_bs: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description_bs">Opis (BS)</Label>
                      <Textarea
                        id="description_bs"
                        value={formData.description_bs}
                        onChange={(e) => setFormData({ ...formData, description_bs: e.target.value })}
                        required
                        rows={4}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="image_url">Resim URL</Label>
                    <Input
                      id="image_url"
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="display_order">Sıralama</Label>
                    <Input
                      id="display_order"
                      type="number"
                      min="0"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Aktif</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">
                    {editingId ? 'Güncelle' : 'Oluştur'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    İptal
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Yükleniyor...</p>
              </CardContent>
            </Card>
          ) : carouselItems?.length === 0 ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground">Henüz carousel öğesi yok</p>
              </CardContent>
            </Card>
          ) : (
            carouselItems?.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{item.title_tr}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${item.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {item.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                          Sıra: {item.display_order}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.description_tr}</p>
                      {item.image_url && (
                        <p className="text-xs text-muted-foreground">Resim: {item.image_url}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCarousel;
