import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getUserProfile } from "@/lib/api/user"

export default async function ProfilePage() {
  const profile = await getUserProfile()

  if (!profile) {
    return (
      <Card className="card-glow max-w-2xl">
        <CardHeader>
          <CardTitle>Profil User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Masuk untuk melihat dan mengubah profil kamu.
          </p>
          <Button asChild className="bg-primary text-primary-foreground">
            <Link href="/login">Login sekarang</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-glow max-w-2xl">
      <CardHeader>
        <CardTitle>Profil User</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>Nama</Label>
          <Input defaultValue={profile.name} />
        </div>
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input defaultValue={profile.email} />
        </div>
        <div className="grid gap-2">
          <Label>Nomor HP</Label>
          <Input defaultValue={profile.phone} />
        </div>
        <div className="grid gap-2">
          <Label>Membership</Label>
          <Input defaultValue={profile.membership} readOnly />
        </div>
        <div className="flex gap-3">
          <Button className="bg-primary text-primary-foreground">Simpan Perubahan</Button>
          <Button variant="outline">Batal</Button>
        </div>
      </CardContent>
    </Card>
  )
}
