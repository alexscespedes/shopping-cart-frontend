import type { CartItem } from "./types";

export interface AppState {
  cart: CartItem[];
}

export type Action =
  | { type: "ADD_TO_CART"; productId: number }
  | { type: "INCREASE"; productId: number }
  | { type: "DECREASE"; productId: number }
  | { type: "CLEAR_CART" };

export let state: AppState = {
  cart: [],
};

export function reducer(currentState: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = currentState.cart.find(
        (item) => item.productId === action.productId,
      );

      if (existing) {
        return {
          ...currentState,
          cart: currentState.cart.map((item) =>
            item.productId === action.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }

      return {
        ...currentState,
        cart: [
          ...currentState.cart,
          { productId: action.productId, quantity: 1 },
        ],
      };
    }

    case "INCREASE":
      return {
        ...currentState,
        cart: currentState.cart.map((item) =>
          item.productId === action.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      };

    case "DECREASE":
      return {
        ...currentState,
        cart: currentState.cart
          .map((item) =>
            item.productId === action.productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      };

    case "CLEAR_CART":
      return {
        ...currentState,
        cart: [],
      };

    default:
      return currentState;
  }
}

export function dispatch(action: Action): void {
  state = reducer(state, action);
}
