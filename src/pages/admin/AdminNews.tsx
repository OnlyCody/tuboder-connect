import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const newsSchema = z.object({
  title_tr: z.string().min(1, 'Türkçe başlık gereklidir'),
  title_en: z.string().min(1, 'İngilizce başlık gereklidir'),
  title_bs: z.string().min(1, 'Boşnakça başlık gereklidir'),
  description_tr: z.string().min(1, 'Türkçe özet gereklidir'),
  description_en: z.string().min(1, 'İngilizce özet gereklidir'),
  description_bs: z.string().min(1, 'Boşnakça özet gereklidir'),
  content_tr: z.string().optional(),
  content_en: z.string().optional(),
  content_bs: z.string().optional(),
  image_url: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  published_date: z.string().min(1, 'Yayın tarihi gereklidir'),
  is_published: z.boolean(),
});

type NewsFormData = z.infer<typeof newsSchema>;

const AdminNews = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<NewsFormData>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title_tr: '',
      title_en: '',
      title_bs: '',
      description_tr: '',
      description_en: '',
      description_bs: '',
      content_tr: '',
      content_en: '',
      content_bs: '',
      image_url: '',
      published_date: new Date().toISOString().split('T')[0],
      is_published: false,
    },
  });

  const { data: newsItems, isLoading } = useQuery({
    queryKey: ['admin-news'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('published_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: NewsFormData) => {
      const { error } = await supabase.from('news').insert([{
        title_tr: data.title_tr,
        title_en: data.title_en,
        title_bs: data.title_bs,
        description_tr: data.description_tr,
        description_en: data.description_en,
        description_bs: data.description_bs,
        content_tr: data.content_tr || null,
        content_en: data.content_en || null,
        content_bs: data.content_bs || null,
        image_url: data.image_url || null,
        published_date: data.published_date,
        is_published: data.is_published,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({ title: 'Başarılı', description: 'Haber eklendi' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Haber eklenirken hata oluştu', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: NewsFormData }) => {
      const { error } = await supabase.from('news').update({
        title_tr: data.title_tr,
        title_en: data.title_en,
        title_bs: data.title_bs,
        description_tr: data.description_tr,
        description_en: data.description_en,
        description_bs: data.description_bs,
        content_tr: data.content_tr || null,
        content_en: data.content_en || null,
        content_bs: data.content_bs || null,
        image_url: data.image_url || null,
        published_date: data.published_date,
        is_published: data.is_published,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({ title: 'Başarılı', description: 'Haber güncellendi' });
      setIsDialogOpen(false);
      setEditingNews(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Haber güncellenirken hata oluştu', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('news').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-news'] });
      toast({ title: 'Başarılı', description: 'Haber silindi' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Haber silinirken hata oluştu', variant: 'destructive' });
    },
  });

  const onSubmit = (data: NewsFormData) => {
    if (editingNews) {
      updateMutation.mutate({ id: editingNews.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (news: any) => {
    setEditingNews(news);
    form.reset({
      title_tr: news.title_tr,
      title_en: news.title_en,
      title_bs: news.title_bs,
      description_tr: news.description_tr,
      description_en: news.description_en,
      description_bs: news.description_bs,
      content_tr: news.content_tr || '',
      content_en: news.content_en || '',
      content_bs: news.content_bs || '',
      image_url: news.image_url || '',
      published_date: news.published_date,
      is_published: news.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu haberi silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingNews(null);
    form.reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Haberler Yönetimi</h1>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Haber Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingNews ? 'Haber Düzenle' : 'Yeni Haber Ekle'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs defaultValue="tr" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="tr">Türkçe</TabsTrigger>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="bs">Bosanski</TabsTrigger>
                    </TabsList>

                    <TabsContent value="tr" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title_tr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Başlık</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description_tr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Özet</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content_tr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İçerik</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="en" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="bs" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title_bs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Naslov</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description_bs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Opis</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="content_bs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sadržaj</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resim URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="published_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Yayın Tarihi</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_published"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Yayınla</FormLabel>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={handleDialogClose}>
                      İptal
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingNews ? 'Güncelle' : 'Ekle'}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Yükleniyor...</div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık (TR)</TableHead>
                  <TableHead>Yayın Tarihi</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newsItems?.map((news) => (
                  <TableRow key={news.id}>
                    <TableCell className="font-medium">{news.title_tr}</TableCell>
                    <TableCell>{new Date(news.published_date).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          news.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {news.is_published ? 'Yayında' : 'Taslak'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(news)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(news.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNews;
