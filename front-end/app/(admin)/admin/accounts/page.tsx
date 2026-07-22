import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Filter } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminAccounts } from "@/lib/api/admin";

async function createAccountAction(formData: FormData) {
  "use server";

  const token = await (await cookies()).get("bn_token")?.value;
  if (!token) return;

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
      password: formData.get("password"),
      role: formData.get("role") || "USER",
      status: formData.get("status") || "ACTIVE",
      membership: formData.get("membership") || "STANDARD",
    }),
  });

  revalidatePath("/admin/accounts");
}

async function updateAccountAction(formData: FormData) {
  "use server";

  const token = await (await cookies()).get("bn_token")?.value;
  if (!token) return;

  const id = String(formData.get("id"));

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      role: formData.get("role"),
      status: formData.get("status"),
      membership: formData.get("membership"),
    }),
  });

  revalidatePath("/admin/accounts");
}

async function deleteAccountAction(formData: FormData) {
  "use server";

  const token = await (await cookies()  ).get("bn_token")?.value;
  if (!token) return;

  const id = String(formData.get("id"));

  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath("/admin/accounts");
}

export default async function AdminAccountsPage() {
  const accounts = await getAdminAccounts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase text-muted-foreground">CRUD Akun</p>
          <h1 className="text-2xl font-semibold text-foreground">
            Kelola Akun
          </h1>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="size-4" /> Filter
        </Button>
      </div>

      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>
            Tambah Akun
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action={createAccountAction}
            className="grid gap-3 md:grid-cols-3"
          >
            <input
              name="name"
              placeholder="Nama"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
              required
            />
            <input
              name="phone"
              placeholder="No HP"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
              required
            />
            <select
              name="role"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <select
              name="status"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
            <select
              name="membership"
              className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
            >
              <option value="STANDARD">STANDARD</option>
              <option value="GOLD">GOLD</option>
              <option value="PLATINUM">PLATINUM</option>
            </select>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground md:col-span-2"
            >
              Simpan Akun
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-card/70">
        <CardHeader>
          <CardTitle>
            Data Akun
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Daftar</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    <form
                      action={updateAccountAction}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="id" value={account.id} />
                      <select
                        name="role"
                        defaultValue={
                          account.role === "admin" ? "ADMIN" : "USER"
                        }
                        className="h-9 rounded-lg border border-input bg-background px-2 text-xs"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <select
                        name="status"
                        defaultValue={
                          account.status === "inactive" ? "INACTIVE" : "ACTIVE"
                        }
                        className="h-9 rounded-lg border border-input bg-background px-2 text-xs"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                      <select
                        name="membership"
                        defaultValue={
                          account.membership === "Platinum"
                            ? "PLATINUM"
                            : account.membership === "Gold"
                              ? "GOLD"
                              : "STANDARD"
                        }
                        className="h-9 rounded-lg border border-input bg-background px-2 text-xs"
                      >
                        <option value="STANDARD">STANDARD</option>
                        <option value="GOLD">GOLD</option>
                        <option value="PLATINUM">PLATINUM</option>
                      </select>
                      <Button type="submit" size="sm" variant="outline">
                        Update
                      </Button>
                    </form>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        account.status === "active" ? "success" : "danger"
                      }
                    >
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.joinedAt}</TableCell>
                  <TableCell>
                    <form action={deleteAccountAction}>
                      <input type="hidden" name="id" value={account.id} />
                      <Button size="sm" variant="destructive">
                        Hapus
                      </Button>
                    </form>
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
