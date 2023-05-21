import prisma from "@/lib/prisma";

// params:
// status: status of order

export default async function handler(req, res) {
  // get the new drink and price from the query string
  const { status } = req.body;

  if (req.method !== "PATCH" && req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  // find order by id
  // let order = orders.find((order) => order.id == req.query.id);
  let order = await prisma.order.findUnique({
    where: {
      id: req.query.id,
    },
  });

  if(req.method === "GET") {
    res.status(200).json({ data: order });
    return;
  }

  // update the order status
  // order.order.orderStatus = status;
  order = await prisma.order.update({
    where: {
      id: req.query.id,
    },
    data: {
      status: status,
    },
  });

  res.status(200).json({ data: order });
}