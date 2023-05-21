import { calcTotal, removeFromCart, removeAllFromCart } from "@/pages/cart/index";
import { addToCart } from "@/pages/item/[id].jsx";

// reset the cart before each test so it always starts empty
beforeEach(() => {
  localStorage.setItem("cart", JSON.stringify([]));
});

describe("cart", () => {
  it("should calculate total from items in the cart", () => {
    const cart = [{id:486170048,title:"Hot Tea",price:3.49,size:"venti"},{id:950239128,title:"Strawberry Açaí",price:3.79,size:"grande"}];

    expect(parseFloat(calcTotal(cart))).toBe(7.28);
  });

  it("should add item to cart", () => {
    const item = {
      id: 1,
      name: "Hot Tea",
      price: 3.49,
      grandePrice: 3.49,
      ventiPrice: 3.49,
      size: "venti",
    };

    addToCart(item, "venti");

    const itemFromStorage = JSON.parse(localStorage.getItem("cart"));

    expect(itemFromStorage[0].title).toEqual(item.name);
  });

  it("should remove item from cart", () => {
    const item = {
      id: 1,
      title: "Cafe Latte",
      price: 4.49,
    };

    addToCart(item);

    const removed = removeFromCart(item.id);

    expect(localStorage.getItem("cart")).toBe("[]");
  });

  it("should remove all items from cart", () => {
    const item = [{
      id: 1,
      title: "Cafe Latte",
      price: 4.49,
    },
    {
      id: 2,
      title: "Cafe Mocha",
      price: 4.49,
    }];

    addToCart(item[0]);
    addToCart(item[1]);

    removeAllFromCart();

    expect(localStorage.getItem("cart")).toBeNull();
  });
});
