// const contentful = require("contentful");

const client = contentful.createClient({
  space: "8phiap0ji3ws",
  environment: "master", // defaults to 'master' if not set
  accessToken: "o5gsyhYxoO9RpMmU0m2yMmSBH50w7LaJYzGpLAz7S5U",
});
// console.log(client);

// variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
//cart
let cart = [];
let buttonDOM = [];
//getting the products
class Products {
  async getProducts() {
    try {
      let contentful = await client.getEntries({
        content_type: "furnitureProducts",
      });
      // .then((response) => console.log(response.items))
      // .catch(console.error);
      // let result = await fetch("products.json");
      // let data = await result.json();
      // let products = data.items;
      let products = contentful.items;
      products = products.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { item, price, id, image, title };
      });
      return products;
    } catch (error) {}
  }
}
//display products-get and manipulate and display
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `<!-- single product -->
        <article class="product">
          <div class="img-container">
            <img src=${product.image} alt="" class="product-img" />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fa-solid fa-cart-shopping"></i>
              add to bag
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>`;
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")]; //get nodelist convert into array for ease
    buttonDOM = buttons;
    buttons.forEach((button) => {
      let id = button.dataset.id;
      //if that item already in cart set incart on load
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      // if the button is clicked later then set it in cart
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;

        //get product from products
        let cartItem = { ...Storage.getProducts(id), amount: 1 };
        cart = [...cart, cartItem]; // ad item to cart and store in local storage;
        Storage.saveCart(cart);
        // console.log(cartItem);

        //set cart values
        this.setCartValues(cart);
        this.showCart();
      });

      // console.log(id);
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    let content = "";
    cart.forEach((cartItem) => {
      tempTotal += cartItem.price * cartItem.amount;
      itemsTotal += cartItem.amount;
      content += `<div class="cart-item">
            <img src=${cartItem.image} alt="" />
            <div>
              <h4>${cartItem.title}</h4>
              <h5>${cartItem.price}</h5>
              <span class="remove-item" data-id=${cartItem.id}>Remove</span>
            </div>
            <div>
              <i class="fa-solid fa-chevron-up" data-id=${cartItem.id}></i>
              <p class="item-amount" >${cartItem.amount}</p>
              <i class="fa-solid fa-chevron-down" data-id=${cartItem.id}></i>
            </div>
          </div>`;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    cartContent.innerHTML = content;
    // console.log(cartTotal, cartItems, cartContent);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  setUpApp() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    }); // why not clear cart directly because it will not refer to ui class

    // particular item remove/increase/decrease using event bublling instead of callback functions
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let increaseItem = event.target;
        let id = increaseItem.dataset.id;
        cart.forEach((item) => {
          if (item.id === id) {
            item.amount += 1;
            cartTotal.innerText = cartTotal.innerText + item.price;
            this.setCartValues(cart);
            Storage.saveCart(cart);
          }
        });
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let decreaseItem = event.target;
        let id = decreaseItem.dataset.id;
        cart.forEach((item) => {
          if (item.id === id) {
            item.amount -= 1;
            cartTotal.innerText = cartTotal.innerText - item.price;
            if (item.amount === 0) {
              this.removeItem(id);
            }
            this.setCartValues(cart);
            Storage.saveCart(cart);
          }
        });
      }
    });
  }
  clearCart() {
    // console.log(this);
    let cartItems = cart.map((item) => {
      return item.id;
    });
    cartItems.forEach((id) => this.removeItem(id));
    cartContent.innerHTML = "";
  }
  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    // when the particular item is removed set it enabled and allow add to cart in it
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>
              add to bag`;
  }
  getSingleButton(id) {
    return buttonDOM.find((button) => button.dataset.id === id);
    // returning the particular button id which is being removed from cart
  }
}

//local storgae
class Storage {
  //static method use it without instance
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products)); //using for my few products if have large number of products can use another method.
  }
  static getProducts(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  //setup app
  ui.setUpApp();
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
      // console.log(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
