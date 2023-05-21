import prisma from "@/lib/prisma";

// this will return all orders
export default async function handler(req, res) {
    const data = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            status: {
                in: ["pending", "being made", "ready"]
            }
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    res.status(200).json({ data });
}