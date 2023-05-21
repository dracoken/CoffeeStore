import prisma from "@/lib/prisma";
import { setHttpClientAndAgentOptions } from "next/dist/server/config";

// params:
// order_data: json object of order data
// orderTime: time order should be ready
// price: total price of order
// derived params:
// createdAt: time order was placed
// orderStatus: status of order

export default async function handler(req, res) {
    const { order_data, orderTime, price, user } = req.body;

    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    if (!order_data || !orderTime || !price) {
        res.status(400).json({ error: "Missing required parameters" });
        return;
    }

    let confUser;

    try {
        confUser = await prisma.user.findUnique({ where: { id: user.id } })
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: "Something unexpected occurred." });
    }

    const order = await prisma.order.create({
        data: {
            status: "pending",
            total: parseFloat(price),
            pickupAt: orderTime,
            user: {
                connect: {
                    id: confUser.id,
                }
            },
            data: order_data,
        },
    }).catch((e) => {
        console.log(e);
        res.status(500).json({ error: "Something unexpected occurred." });
        return;
    });

    res.status(200).json({ data: order });
}