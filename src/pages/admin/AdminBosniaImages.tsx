import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, X, ArrowUp, ArrowDown } from 'lucide-react';
import { z } from 'zod';
import { transformGoogleDriveUrl } from '@/lib/utils';

const bosniaImageSchema = z.object({
  title_tr: z.string().min(1, 'Türkçe başlık gereklidir').max(200),
  title_en: z.string().min(1, 'İngilizce başlık gereklidir').max(200),
  title_bs: z.string().min(1, 'Boşnakça başlık gereklidir').max(200),
  image_url: z.string().min(1, 'Resim URL gereklidir'),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type BosniaImageFormData = z.infer<typeof bosniaImageSchema>;

const AdminBosniaImages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BosniaImageFormData>({
    title_tr: '',
    title_en: '',
    title_bs: '',
    image_url: '',
    display_order: 0,
    is_active: true,
  });

  const { data: bosniaImages, isLoading } = useQuery({
    queryKey: ['admin-bosnia-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bosnia_images')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BosniaImageFormData) => {
      const insertData = {
        title_tr: data.title_tr,
        title_en: data.title_en,
        title_bs: data.title_bs,
        image_url: transformGoogleDriveUrl(data.image_url),
        display_order: data.display_order,
        is_active: data.is_active,
      };
      
      const { error } = await supabase
        .from('bosnia_images')
        .insert([insertData]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bosnia-images'] });
      toast({ title: 'Başarılı', description: 'Resim eklendi' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Hata', description: error.message, variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BosniaImageFormData }) => {
      const updateData = {
        title_tr: data.title_tr,
        title_en: data.title_en,
        title_bs: data.title_bs,
        image_url: transformGoogleDriveUrl(data.image_url),
        display_order: data.display_order,
        is_active: data.is_active,
      };
      
      const { error } = await supabase
        .from('bosnia_images')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bosnia-images'] });
      toast({ title: 'Başarılı', description: 'Resim güncellendi' });
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Hata', description: error.message, variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bosnia_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bosnia-images'] });
      toast({ title: 'Başarılı', description: 'Resim silindi' });
    },
    onError: (error) => {
      toast({ title: 'Hata', description: error.message, variant: 'destructive' });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('bosnia_images')
        .update({ display_order: newOrder })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bosnia-images'] });
    },
  });

  const resetForm = () => {
    setFormData({
      title_tr: '',
      title_en: '',
      title_bs: '',
      image_url: '',
      display_order: 0,
      is_active: true,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleEdit = (item: any) => {
    setFormData({
      title_tr: item.title_tr,
      title_en: item.title_en,
      title_bs: item.title_bs,
      image_url: item.image_url,
      display_order: item.display_order || 0,
      is_active: item.is_active ?? true,
    });
    setEditingId(item.id);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      bosniaImageSchema.parse(formData);
      
      if (editingId) {
        updateMutation.mutate({ id: editingId, data: formData });
      } else {
        createMutation.mutate(formData);
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

  const moveUp = (item: any, index: number) => {
    if (index === 0 || !bosniaImages) return;
    const prevItem = bosniaImages[index - 1];
    reorderMutation.mutate({ id: item.id, newOrder: prevItem.display_order });
    reorderMutation.mutate({ id: prevItem.id, newOrder: item.display_order });
  };

  const moveDown = (item: any, index: number) => {
    if (!bosniaImages || index === bosniaImages.length - 1) return;
    const nextItem = bosniaImages[index + 1];
    reorderMutation.mutate({ id: item.id, newOrder: nextItem.display_order });
    reorderMutation.mutate({ id: nextItem.id, newOrder: item.display_order });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Bosna Hersek Tanıtım Resimleri</h1>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Resim Ekle
          </Button>
        </div>

        {isFormOpen && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{editingId ? 'Resim Düzenle' : 'Yeni Resim Ekle'}</CardTitle>
                <Button variant="ghost" size="icon" onClick={resetForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="tr">
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
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <Label htmlFor="image_url">Resim URL (Google Drive linki desteklenir)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_order">Sıralama</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="is_active">Aktif</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    İptal
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingId ? 'Güncelle' : 'Ekle'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-8">Yükleniyor...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bosniaImages?.map((item, index) => (
              <Card key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                <CardContent className="p-4">
                  <div className="aspect-[4/3] mb-4 bg-muted rounded overflow-hidden">
                    {item.image_url && (
                      <img
                        src={transformGoogleDriveUrl(item.image_url)}
                        alt={item.title_tr}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title_tr}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sıra: {item.display_order} | {item.is_active ? 'Aktif' : 'Pasif'}
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => moveUp(item, index)} disabled={index === 0}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => moveDown(item, index)} disabled={index === (bosniaImages?.length || 0) - 1}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Bu resmi silmek istediğinize emin misiniz?')) {
                          deleteMutation.mutate(item.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!bosniaImages || bosniaImages.length === 0) && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              Henüz resim eklenmemiş. "Resim Ekle" butonuna tıklayarak başlayın.
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBosniaImages;
