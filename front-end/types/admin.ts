export interface AdminStats {
  totalUsers: number;
  totalBookings: number;
  totalTransactions: number;
  totalServices: number;
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  membership: "Standard" | "Gold" | "Platinum";
  joinedAt: string;
}
