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
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
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

const boardMemberSchema = z.object({
  name_tr: z.string().min(1, 'Türkçe isim gereklidir'),
  name_en: z.string().min(1, 'İngilizce isim gereklidir'),
  name_bs: z.string().min(1, 'Boşnakça isim gereklidir'),
  position_tr: z.string().min(1, 'Türkçe pozisyon gereklidir'),
  position_en: z.string().min(1, 'İngilizce pozisyon gereklidir'),
  position_bs: z.string().min(1, 'Boşnakça pozisyon gereklidir'),
  bio_tr: z.string().optional(),
  bio_en: z.string().optional(),
  bio_bs: z.string().optional(),
  photo_url: z.string().url('Geçerli bir URL giriniz').optional().or(z.literal('')),
  display_order: z.number().int().min(0),
  is_active: z.boolean(),
});

type BoardMemberFormData = z.infer<typeof boardMemberSchema>;

const AdminBoard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BoardMemberFormData>({
    resolver: zodResolver(boardMemberSchema),
    defaultValues: {
      name_tr: '',
      name_en: '',
      name_bs: '',
      position_tr: '',
      position_en: '',
      position_bs: '',
      bio_tr: '',
      bio_en: '',
      bio_bs: '',
      photo_url: '',
      display_order: 0,
      is_active: true,
    },
  });

  const { data: boardMembers, isLoading } = useQuery({
    queryKey: ['admin-board-members'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('board_members')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BoardMemberFormData) => {
      const { error } = await supabase.from('board_members').insert([{
        name_tr: data.name_tr,
        name_en: data.name_en,
        name_bs: data.name_bs,
        position_tr: data.position_tr,
        position_en: data.position_en,
        position_bs: data.position_bs,
        bio_tr: data.bio_tr || null,
        bio_en: data.bio_en || null,
        bio_bs: data.bio_bs || null,
        photo_url: data.photo_url || null,
        display_order: data.display_order,
        is_active: data.is_active,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-board-members'] });
      toast({ title: 'Başarılı', description: 'Üye eklendi' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Üye eklenirken hata oluştu', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BoardMemberFormData }) => {
      const { error } = await supabase.from('board_members').update({
        name_tr: data.name_tr,
        name_en: data.name_en,
        name_bs: data.name_bs,
        position_tr: data.position_tr,
        position_en: data.position_en,
        position_bs: data.position_bs,
        bio_tr: data.bio_tr || null,
        bio_en: data.bio_en || null,
        bio_bs: data.bio_bs || null,
        photo_url: data.photo_url || null,
        display_order: data.display_order,
        is_active: data.is_active,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-board-members'] });
      toast({ title: 'Başarılı', description: 'Üye güncellendi' });
      setIsDialogOpen(false);
      setEditingMember(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Üye güncellenirken hata oluştu', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('board_members').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-board-members'] });
      toast({ title: 'Başarılı', description: 'Üye silindi' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'Üye silinirken hata oluştu', variant: 'destructive' });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ id, newOrder }: { id: string; newOrder: number }) => {
      const { error } = await supabase
        .from('board_members')
        .update({ display_order: newOrder })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-board-members'] });
    },
  });

  const onSubmit = (data: BoardMemberFormData) => {
    // Google Drive URL'lerini otomatik dönüştür
    if (data.photo_url) {
      data.photo_url = transformGoogleDriveUrl(data.photo_url);
    }
    
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    form.reset({
      name_tr: member.name_tr,
      name_en: member.name_en,
      name_bs: member.name_bs,
      position_tr: member.position_tr,
      position_en: member.position_en,
      position_bs: member.position_bs,
      bio_tr: member.bio_tr || '',
      bio_en: member.bio_en || '',
      bio_bs: member.bio_bs || '',
      photo_url: member.photo_url || '',
      display_order: member.display_order,
      is_active: member.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu üyeyi silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleMoveUp = (member: any, index: number) => {
    if (index === 0) return;
    const prevMember = boardMembers![index - 1];
    reorderMutation.mutate({ id: member.id, newOrder: prevMember.display_order });
    reorderMutation.mutate({ id: prevMember.id, newOrder: member.display_order });
  };

  const handleMoveDown = (member: any, index: number) => {
    if (index === boardMembers!.length - 1) return;
    const nextMember = boardMembers![index + 1];
    reorderMutation.mutate({ id: member.id, newOrder: nextMember.display_order });
    reorderMutation.mutate({ id: nextMember.id, newOrder: member.display_order });
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingMember(null);
    form.reset();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Yönetim Kurulu Üyeleri</h1>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Üye Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? 'Üye Düzenle' : 'Yeni Üye Ekle'}
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
                        name="name_tr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>İsim</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position_tr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pozisyon</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio_tr"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biyografi</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="en" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio_en"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biography</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>

                    <TabsContent value="bs" className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name_bs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ime</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position_bs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pozicija</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio_bs"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Biografija</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>

                  <FormField
                    control={form.control}
                    name="photo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fotoğraf URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="display_order"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sıralama</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel>Aktif</FormLabel>
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
                      {editingMember ? 'Güncelle' : 'Ekle'}
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
                  <TableHead>Sıra</TableHead>
                  <TableHead>İsim (TR)</TableHead>
                  <TableHead>Pozisyon (TR)</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {boardMembers?.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveUp(member, index)}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleMoveDown(member, index)}
                          disabled={index === boardMembers.length - 1}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{member.name_tr}</TableCell>
                    <TableCell>{member.position_tr}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          member.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {member.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(member)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(member.id)}
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

export default AdminBoard;
