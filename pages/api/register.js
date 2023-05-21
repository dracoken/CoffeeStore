import prisma from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const { email, worker } = req.body;
    let user;

    try {
        user = await prisma.user.create({
            data: {
                email: email,
                worker: worker,
                username: email.split("@")[0],
            }
        });
    } catch (error) {
        res.status(400).json({ error: "Something went wrong" });
        return;
    }

    if (!user) {
        res.status(400).json({ error: "Something went wrong" });
        return;
    }

    res.status(200).json({ data: user });
}