export interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  membership: "Standard" | "Gold" | "Platinum"
}
