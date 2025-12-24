import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const businessSchema = z.object({
  category_id: z.string().min(1, 'Kategori seçiniz'),
  business_name: z.string().min(1, 'İşyeri adı gereklidir'),
  owner_name: z.string().min(1, 'Sahip adı gereklidir'),
  phone: z.string().optional(),
  address: z.string().optional(),
  display_order: z.coerce.number().min(0),
  is_active: z.boolean(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

const AdminBusinesses = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      category_id: '',
      business_name: '',
      owner_name: '',
      phone: '',
      address: '',
      display_order: 0,
      is_active: true,
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-business-categories-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_categories')
        .select('id, name_tr')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const { data: businesses, isLoading } = useQuery({
    queryKey: ['admin-member-businesses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('member_businesses')
        .select(`
          *,
          business_categories (
            name_tr
          )
        `)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BusinessFormData) => {
      const { error } = await supabase.from('member_businesses').insert([{
        category_id: data.category_id,
        business_name: data.business_name,
        owner_name: data.owner_name,
        phone: data.phone || null,
        address: data.address || null,
        display_order: data.display_order,
        is_active: data.is_active,
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-member-businesses'] });
      toast({ title: 'Başarılı', description: 'İşyeri eklendi' });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Hata', description: 'İşyeri eklenirken hata oluştu', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BusinessFormData }) => {
      const { error } = await supabase.from('member_businesses').update({
        category_id: data.category_id,
        business_name: data.business_name,
        owner_name: data.owner_name,
        phone: data.phone || null,
        address: data.address || null,
        display_order: data.display_order,
        is_active: data.is_active,
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-member-businesses'] });
      toast({ title: 'Başarılı', description: 'İşyeri güncellendi' });
      setIsDialogOpen(false);
      setEditingBusiness(null);
      form.reset();
    },
    onError: () => {
      toast({ title: 'Hata', description: 'İşyeri güncellenirken hata oluştu', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('member_businesses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-member-businesses'] });
      toast({ title: 'Başarılı', description: 'İşyeri silindi' });
    },
    onError: () => {
      toast({ title: 'Hata', description: 'İşyeri silinirken hata oluştu', variant: 'destructive' });
    },
  });

  const onSubmit = (data: BusinessFormData) => {
    if (editingBusiness) {
      updateMutation.mutate({ id: editingBusiness.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (business: any) => {
    setEditingBusiness(business);
    form.reset({
      category_id: business.category_id,
      business_name: business.business_name,
      owner_name: business.owner_name,
      phone: business.phone || '',
      address: business.address || '',
      display_order: business.display_order || 0,
      is_active: business.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu işyerini silmek istediğinizden emin misiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingBusiness(null);
      form.reset();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Üye İşyerleri</h1>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                İşyeri Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBusiness ? 'İşyeri Düzenle' : 'Yeni İşyeri Ekle'}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kategori</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Kategori seçiniz" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories?.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name_tr}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="business_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İşyeri Adı</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="owner_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sahip Adı</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="+90 5xx xxx xx xx" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input type="number" {...field} />
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
                    <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                      İptal
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingBusiness ? 'Güncelle' : 'Ekle'}
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
                  <TableHead>İşyeri Adı</TableHead>
                  <TableHead>Sahip</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses?.map((business: any) => (
                  <TableRow key={business.id}>
                    <TableCell>{business.display_order}</TableCell>
                    <TableCell className="font-medium">{business.business_name}</TableCell>
                    <TableCell>{business.owner_name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {business.business_categories?.name_tr}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          business.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {business.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(business)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(business.id)}
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

export default AdminBusinesses;
