import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    // get id from request body
    let id = JSON.parse(req.body).user

    const data = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            },
            userId: id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    res.status(200).json({ data });
}
