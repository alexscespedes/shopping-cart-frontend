import type { CartItem } from "./types";
import { fakeCheckoutApi } from "./api";

export interface AppState {
  cart: CartItem[];
  checkoutStatus: "idle" | "loading" | "success" | "error";
}

export type Action =
  | { type: "ADD_TO_CART"; productId: number }
  | { type: "INCREASE"; productId: number }
  | { type: "DECREASE"; productId: number }
  | { type: "CLEAR_CART" }
  | { type: "CHECKOUT_REQUEST" }
  | { type: "CHECKOUT_SUCCESS" }
  | { type: "CHECKOUT_FAILURE" }
  | { type: "CHECKOUT" }; //async trigger

export type Dispatch = (action: Action) => void;

export type Middleware = (
  state: AppState,
  action: Action,
  next: Dispatch,
) => void;

export let state: AppState = {
  cart: [],
  checkoutStatus: "idle",
};

function baseDispatch(action: Action): void {
  state = reducer(state, action);

  listeners.forEach((listener) => listener());
}

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

    case "CHECKOUT_REQUEST":
      return {
        ...currentState,
        checkoutStatus: "loading",
      };

    case "CHECKOUT_SUCCESS":
      return {
        cart: [],
        checkoutStatus: "success",
      };

    case "CHECKOUT_FAILURE":
      return {
        ...currentState,
        checkoutStatus: "error",
      };

    default:
      return currentState;
  }
}

let dispatch: Dispatch = baseDispatch;

export function applyMiddleware(...middlewares: Middleware[]) {
  dispatch = middlewares.reduceRight((next, middleware) => {
    return (action: Action) => middleware(state, action, next);
  }, baseDispatch);
}

export function getDispatch(): Dispatch {
  return dispatch;
}

export const loggerMiddleware: Middleware = (currentState, action, next) => {
  console.group(`Action: ${action.type}`);
  console.log("Previous State:", currentState);
  console.log("Action Payload:", action);

  next(action);

  console.log("Next State:", state);
  console.groupEnd();
};

export const asyncMiddleware: Middleware = (currentState, action, next) => {
  if (action.type == "CHECKOUT") {
    if (currentState.cart.length === 0) {
      return;
    }

    next({ type: "CHECKOUT_REQUEST" });

    fakeCheckoutApi()
      .then(() => {
        next({ type: "CHECKOUT_SUCCESS" });
      })
      .catch(() => {
        next({ type: "CHECKOUT_FAILURE" });
      });
    return;
  }

  next(action);
};

type Listener = () => void;

const listeners: Listener[] = [];

export function subscribe(listener: Listener): () => void {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) listeners.splice(index, 1);
  };
}
