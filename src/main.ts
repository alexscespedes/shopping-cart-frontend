import "./style.css";
import { products } from "./data";
import { renderProducts } from "./render/products";
import { renderCart } from "./render/cart";

const productList = document.getElementById("productList")!;
const cartItems = document.getElementById("cartItems")!;
const cartTotal = document.getElementById("cartTotal")!;

function renderApp() {
  renderProducts(productList, products, renderApp);
  renderCart(cartItems, cartTotal, renderApp);
}

renderApp();
