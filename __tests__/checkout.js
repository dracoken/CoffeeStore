import { addToCart } from "../pages/item/[id].jsx";
import { placeOrder } from "@/pages/cart/checkout.jsx";

global.fetch = jest.fn(() =>
  Promise.resolve({
    data: {
      id: 718058477,
      order: {
        order_data:
          '[{id: 559534800, title: "Americano", price: 3.89, size: "venti"}]',
        orderTime: "2023-02-10T02:35:12.329Z",
        price: "3.29",
        createdAt: "2023-02-10T02:35:29.489Z",
        orderStatus: "pending",
      },
    },
  })
);

describe("checkout", () => {
  it("places an order", async () => {
    const item = {
      id: 1,
      title: "Americano",
      price: 3.29,
      size: "grande",
      pricing: {
        grande: 3.29,
        venti: 3.89,
      },
    };
    addToCart(item);
    const res = await placeOrder(item, new Date().toISOString, 3.29);

    expect(res.data.id).toEqual(718058477);
  });
});
