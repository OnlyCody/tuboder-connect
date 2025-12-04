import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { transformGoogleDriveUrl } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const eventSchema = z.object({
  title_tr: z.string().min(1, 'Türkçe başlık gereklidir'),
  title_en: z.string().min(1, 'İngilizce başlık gereklidir'),
  title_bs: z.string().min(1, 'Boşnakça başlık gereklidir'),
  description_tr: z.string().min(1, 'Türkçe açıklama gereklidir'),
  description_en: z.string().min(1, 'İngilizce açıklama gereklidir'),
  description_bs: z.string().min(1, 'Boşnakça açıklama gereklidir'),
  content_tr: z.string().optional(),
  content_en: z.string().optional(),
  content_bs: z.string().optional(),
  location_tr: z.string().optional(),
  location_en: z.string().optional(),
  location_bs: z.string().optional(),
  image_url: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  event_date: z.string().min(1, 'Etkinlik tarihi gereklidir'),
  is_published: z.boolean(),
});

type EventFormData = z.infer<typeof eventSchema>;

const AdminEvents = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
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
      location_tr: '',
      location_en: '',
      location_bs: '',
      image_url: '',
      event_date: new Date().toISOString().split('T')[0],
      is_published: false,
    },
  });

  const { data: events, isLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const { error } = await supabase.from('events').insert([{
        title_tr: data.title_tr,
        title_en: data.title_en,
        title_bs: data.title_bs,
        description_tr: data.description_tr,
        description_en: data.description_en,
        description_bs: data.description_bs,
        content_tr: data.content_tr || null,
        content_en: data.content_en || null,
        content_bs: data.content_bs || null,
        location_tr: data.location_tr || null,
        location_en: data.location_en || null,
        location_bs: data.location_bs || null,
        image_url: data.image_url || null,
        event_date: data.event_date,
        is_published: data.is_published,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Başarılı', description: 'Etkinlik eklendi' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Etkinlik eklenirken hata oluştu', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EventFormData }) => {
      const { error } = await supabase.from('events').update({
        title_tr: data.title_tr,
        title_en: data.title_en,
        title_bs: data.title_bs,
        description_tr: data.description_tr,
        description_en: data.description_en,
        description_bs: data.description_bs,
        content_tr: data.content_tr || null,
        content_en: data.content_en || null,
        content_bs: data.content_bs || null,
        location_tr: data.location_tr || null,
        location_en: data.location_en || null,
        location_bs: data.location_bs || null,
        image_url: data.image_url || null,
        event_date: data.event_date,
        is_published: data.is_published,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Başarılı', description: 'Etkinlik güncellendi' });
      setIsDialogOpen(false);
      setEditingEvent(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Etkinlik güncellenirken hata oluştu', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Başarılı', description: 'Etkinlik silindi' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Etkinlik silinirken hata oluştu', variant: 'destructive' });
    },
  });

  const onSubmit = (data: EventFormData) => {
    // Google Drive URL'lerini otomatik dönüştür
    if (data.image_url) {
      data.image_url = transformGoogleDriveUrl(data.image_url);
    }
    
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    form.reset({
      title_tr: event.title_tr,
      title_en: event.title_en,
      title_bs: event.title_bs,
      description_tr: event.description_tr,
      description_en: event.description_en,
      description_bs: event.description_bs,
      content_tr: event.content_tr || '',
      content_en: event.content_en || '',
      content_bs: event.content_bs || '',
      location_tr: event.location_tr || '',
      location_en: event.location_en || '',
      location_bs: event.location_bs || '',
      image_url: event.image_url || '',
      event_date: event.event_date,
      is_published: event.is_published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingEvent(null);
      form.reset();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Etkinlikler Yönetimi</h1>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Etkinlik Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? 'Etkinlik Düzenle' : 'Yeni Etkinlik Ekle'}
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
                            <FormLabel>Açıklama</FormLabel>
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
                      <FormField
                        control={form.control}
                        name="location_tr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Konum</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                      <FormField
                        control={form.control}
                        name="location_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                      <FormField
                        control={form.control}
                        name="location_bs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Lokacija</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                    name="event_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etkinlik Tarihi</FormLabel>
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
                    <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                      İptal
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingEvent ? 'Güncelle' : 'Ekle'}
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
                  <TableHead>Tarih</TableHead>
                  <TableHead>Konum (TR)</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events?.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title_tr}</TableCell>
                    <TableCell>{new Date(event.event_date).toLocaleDateString('tr-TR')}</TableCell>
                    <TableCell>{event.location_tr || '-'}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          event.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.is_published ? 'Yayında' : 'Taslak'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(event)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(event.id)}
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

export default AdminEvents;
