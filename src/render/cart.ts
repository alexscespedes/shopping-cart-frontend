import { cart, increase, decrease } from "../state";
import { products } from "../data";

export function renderCart(
  container: HTMLElement,
  totalElement: HTMLElement,
  refresh: () => void,
) {
  container.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    total += product.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
        <span>${product.name} x ${item.quantity}</span>
        <div class="cart-controls">
            <button>-</button>
            <button>+</button>
        </div>
    `;

    const [minus, plus] = div.querySelectorAll("button");

    minus.addEventListener("click", () => {
      decrease(product.id);
      refresh();
    });

    plus.addEventListener("click", () => {
      increase(product.id);
      refresh();
    });

    container.appendChild(div);
  });

  totalElement.textContent = `Total: $${total}`;
}
