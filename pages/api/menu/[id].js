import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    const { id } = req.query;

    let data;
    try {
        data = await prisma.menu.findUnique({
            where: {
                id: id
            }
        });
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: "An unexpected error occurred." });
    }

    res.status(200).json({ data });
}