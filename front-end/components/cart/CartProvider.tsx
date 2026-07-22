"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { ServiceItem } from "@/types";

export interface CartItem {
  service: ServiceItem;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (service: ServiceItem) => void;
  incrementItem: (serviceId: string) => void;
  decrementItem: (serviceId: string) => void;
  removeItem: (serviceId: string) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const CART_STORAGE_KEY = "bn_user_cart";

function getServicePrice(service: ServiceItem) {
  return service.pricePackage ?? service.price ?? 0;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const persistedValue = window.localStorage.getItem(CART_STORAGE_KEY);
      if (!persistedValue) return;

      const parsed = JSON.parse(persistedValue) as CartItem[];
      if (!Array.isArray(parsed)) return;

      setItems(parsed);
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (service: ServiceItem) => {
    setItems((current) => {
      const existing = current.find((item) => item.service.id === service.id);
      if (existing) {
        return current.map((item) =>
          item.service.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...current, { service, quantity: 1 }];
    });
  };

  const incrementItem = (serviceId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.service.id === serviceId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const decrementItem = (serviceId: string) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.service.id !== serviceId) return item;
        if (item.quantity <= 1) return [];

        return { ...item, quantity: item.quantity - 1 };
      }),
    );
  };

  const removeItem = (serviceId: string) => {
    setItems((current) =>
      current.filter((item) => item.service.id !== serviceId),
    );
  };

  const clear = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + getServicePrice(item.service) * item.quantity,
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clear,
      totalItems,
      totalPrice,
    }),
    [items, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
