import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCatalogServices } from "@/lib/api/catalog";
import { formatCurrency } from "@/lib/utils/formatters";
import { UpdateService } from "@/components/catalog/UpdateService";

//------------// Service Create //--------------//
async function createServiceAction(formData: FormData) {
  "use server";

  const token = (await cookies()).get("bn_token")?.value;
  console.log("TOKEN:", token ? "ada" : "tidak ada");
  if (!token) return;

  // 1. Upload gambar dulu ke Cloudinary via backend
  const imageFile = formData.get("imageURL") as File;
  console.log("IMAGE FILE:", imageFile?.name, imageFile?.size);
  let imageURL = "";

  if (imageFile && imageFile.size > 0) {
    const imageFormData = new FormData();
    imageFormData.append("file", imageFile);

    const uploadRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/services/upload-image`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: imageFormData,
      },
    );

    console.log("UPLOAD STATUS:", uploadRes.status);
    const uploadData = await uploadRes.json();
    console.log("UPLOAD DATA:", uploadData);
    imageURL = uploadData.url;
  }

  // 2. Simpan layanan dengan URL gambar dari Cloudinary
  const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      durationMinutes: Number(formData.get("durationMinutes")),
      category: formData.get("category"),
      status: formData.get("status"),
      imageURL,
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Gagal menyimpan layanan: ${createRes.status}`);
  }

  revalidatePath("/admin/catalog");
  revalidatePath("/catalog");
}

//------------// Service Update //--------------//
async function updateServiceAction(
  formData: FormData,
): Promise<{ success: boolean }> {
  "use server";

  const token = (await cookies()).get("bn_token")?.value;
  if (!token) return { success: false };

  const id = String(formData.get("id"));

  const payload: Record<string, unknown> = {
    name: formData.get("name") || undefined,
    description: formData.get("description") || undefined,
    price: formData.get("price") ? Number(formData.get("price")) : undefined,
    durationMinutes: formData.get("durationMinutes")
      ? Number(formData.get("durationMinutes"))
      : undefined,
    category: formData.get("category") || undefined,
    status: formData.get("status") || undefined,
    imageURL: formData.get("imageURL") || undefined,
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  revalidatePath("/admin/catalog");
  revalidatePath("/catalog");

  return { success: res.ok };
}

//------------// Service Delete //--------------//
async function deleteServiceAction(formData: FormData) {
  "use server";

  const token = (await cookies()).get("bn_token")?.value;
  if (!token) return;

  const id = String(formData.get("id"));

  const deleteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/services/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!deleteRes.ok) {
    throw new Error(`Gagal menghapus layanan: ${deleteRes.status}`);
  }

  revalidatePath("/admin/catalog");
  revalidatePath("/catalog");
}

export default async function AdminCatalogPage() {
  const services = await getCatalogServices();

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="items-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Kelola Layanan
        </h1>
      </div>
      {/* Form CRUD Layanan */}
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Tambah Layanan</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createServiceAction}
            className="grid gap-3  md:grid-cols-3"
          >
            <Input name="name" placeholder="Nama layanan" required />
            <Input
              name="durationMinutes"
              type="number"
              placeholder="Durasi (menit)"
              required
            />
            <select
              name="category"
              required
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="">Pilih Kategori</option>
              <option value="Anak-anak">Anak-anak</option>
              <option value="Dewasa">Dewasa</option>
              <option value="Promo">Promo</option>
            </select>
            <Input name="price" type="number" placeholder="Harga" required />

            <select
              name="status"
              required
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="">Pilih Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <Input
              name="imageURL"
              type="file"
              accept="image/*"
              required
              className="text-center text-sm text-muted-foreground"
            />
            <Input
              name="description"
              placeholder="Deskripsi"
              required
              className="md:col-span-3"
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground md:col-span-3"
            >
              Tambah Layanan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List Layanan   */}
      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>Daftar Layanan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{formatCurrency(service.price)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.status === "active" ? "success" : "danger"
                      }
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <UpdateService
                        service={service}
                        UpdateAction={updateServiceAction}
                      />
                      <form action={deleteServiceAction}>
                        <input type="hidden" name="id" value={service.id} />
                        <Button size="sm" variant="destructive" type="submit">
                          Hapus
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
