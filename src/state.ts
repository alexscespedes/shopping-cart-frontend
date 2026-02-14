import type { CartItem } from "./types";

export let cart: CartItem[] = [];

export function addToCart(productId: number): void {
  const existing = cart.find((item) => item.productId === productId);

  if (existing) existing.quantity += 1;
  else cart.push({ productId, quantity: 1 });
}

export function increase(productId: number): void {
  const item = cart.find((i) => i.productId === productId);
  if (item) item.quantity += 1;
}

export function decrease(productId: number): void {
  const item = cart.find((i) => i.productId === productId);
  if (!item) return;

  item.quantity -= 1;

  if (item.quantity <= 0) cart = cart.filter((i) => i.productId !== productId);
}
