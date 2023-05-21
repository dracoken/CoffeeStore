import prisma from "@/lib/prisma";
// params:
// status: status of order

export default async function handler(req, res) {
    // get the new status from the request body
    const { status } = req.body;

    if (req.method !== "PATCH" && req.method !== "GET") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    // find order by id
    let order;
    try {
        order = await prisma.order.findUnique({
            where: {
                id: req.query.id,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    if (req.method === "GET") {
        res.status(200).json({ data: order });
        return;
    }

    // update the order status
    try {
        order = await prisma.order.update({
            where: {
                id: req.query.id,
            },
            data: {
                status: status,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }

    res.status(200).json({ data: order });
}