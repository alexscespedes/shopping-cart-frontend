import "./style.css";
import { products } from "./data";
import { renderProducts } from "./render/products";
import { renderCart } from "./render/cart";
import { applyMiddleware, loggerMiddleware, getDispatch } from "./state";

applyMiddleware(loggerMiddleware);
const dispatch = getDispatch();

const productList = document.getElementById("productList")!;
const cartItems = document.getElementById("cartItems")!;
const cartTotal = document.getElementById("cartTotal")!;
const clearBtn = document.getElementById("clearCart")!;

clearBtn.addEventListener("click", () => {
  dispatch({ type: "CLEAR_CART" });
  renderApp();
});

function renderApp() {
  renderProducts(productList, products, renderApp);
  renderCart(cartItems, cartTotal, renderApp);
}

renderApp();
