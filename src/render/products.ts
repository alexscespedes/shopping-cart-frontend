import type { Product } from "../types";
import { addToCart } from "../state";

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
      addToCart(product.id);
      refresh();
    });

    container.appendChild(card);
  });
}
