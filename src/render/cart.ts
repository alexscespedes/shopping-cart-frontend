import {
  state,
  applyMiddleware,
  loggerMiddleware,
  getDispatch,
} from "../state";
import { products } from "../data";

applyMiddleware(loggerMiddleware);
const dispatch = getDispatch();

export function renderCart(
  container: HTMLElement,
  totalElement: HTMLElement,
  refresh: () => void,
) {
  container.innerHTML = "";

  let total = 0;

  state.cart.forEach((item) => {
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
      dispatch({ type: "DECREASE", productId: product.id });
      refresh();
    });

    plus.addEventListener("click", () => {
      dispatch({ type: "INCREASE", productId: product.id });
      refresh();
    });

    container.appendChild(div);
  });

  totalElement.textContent = `Total: $${total}`;

  const status = state.checkoutStatus;

  if (status === "loading") {
    totalElement.textContent += " | Processing...";
  }

  if (status === "success") {
    totalElement.textContent += " | Success!";
  }

  if (status === "error") {
    totalElement.textContent += " | Failed. Try again.";
  }
}
