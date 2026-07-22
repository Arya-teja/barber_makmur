"use client";

import { CartFloatingButton } from "@/components/cart/CartFloatingButton";
import { CartProvider } from "@/components/cart/CartProvider";

export function UserCartShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartFloatingButton />
    </CartProvider>
  );
}
