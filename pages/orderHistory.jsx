import { sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import Head from "next/head";
import Link from "next/link";
import fetchJson from "@/lib/fetchJson";
import { useRouter } from "next/router";
import { CardCustomer } from "../components/cardCustomer";


export default function orderHistory({ user, orders }) {
    const router = useRouter();

    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            // make a request to invalidate the session
            await fetchJson("/api/logout", { method: "POST" });
        } catch (error) {
            console.error("An unexpected error happened:", error);
        }

        // redirect to the home page
        router.push("/");
    }

    return (
        <>
            <Head>
                <title>Past Orders</title>
                <meta
                    name="description"
                    content="An app to order coffee ahead of time"
                />
            </Head>
            <main className="max-w-screen-md mx-auto bg-gray-300 min-h-screen">
                <div className="bg-gray-100 p-4 flex flex-row items-center justify-between">
                    <h1 className="text-3xl">Order History - {user && user.username}</h1>
                    <h1>
                        <a href="/api/logout" onClick={async (e) => handleLogout(e)}>Logout</a>
                    </h1>
                </div>
                <div className="grid gap-4 grid-cols-1 mt-4 mx-4">
                    {orders.data.map((item) => (
                        <CardCustomer order={item} key={item.id}></CardCustomer>
                    ))}
                </div>
            </main>
        </>
    );
}

export async function getOrderData(id) {
    const res = await fetch('http://localhost:3000/api/order', {
        method: 'POST',
        body: JSON.stringify({ user: id }),
    })
    const data = await res.json()

    return data
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
    const user = req.session.user;

    if (user == undefined) {
        res.setHeader("location", "/");
        res.statusCode = 302;
        res.end();
        return {
            props: {
                user: { isLoggedIn: false },
            },
        };
    }

    // TODO: this will need to be switched to user specific once the routes are changed over
    const orders = await getOrderData(user.id);

    return {
        props: {
            user: user,
            orders: orders,
        }
    }
}, sessionOptions)