import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import prisma from "@/lib/prisma";

export default withIronSessionApiRoute(async (req, res) => {
    // check to see if the user exists in the database
    let user = await prisma.user.findUnique({
        where: {
            email: req.body.email,
        },
    });

    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }

    // setup the session data
    const data = {
        isLoggedIn: true,
        id: user.id,
        email: user.email,
        username: user.username,
        worker: user.worker,
    }

    req.session.user = data;

    await req.session.save();

    res.json(data);
}, sessionOptions);
