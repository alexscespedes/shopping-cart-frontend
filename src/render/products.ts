import type { Product } from "../types";
import { applyMiddleware, loggerMiddleware, getDispatch } from "../state";

applyMiddleware(loggerMiddleware);
const dispatch = getDispatch();

export function renderProducts(
  container: HTMLElement,
  products: Product[],
  refresh: () => void,
) {
  container.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.price}</p>
        <button>Add to Cart</button>
    `;

    const button = card.querySelector("button")!;
    button.addEventListener("click", () => {
      dispatch({ type: "ADD_TO_CART", productId: product.id });
      refresh();
    });

    container.appendChild(card);
  });
}
