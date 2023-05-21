import Worker from "@/layouts/worker";
import fetchJson from "@/lib/fetchJson";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Card } from "../components/card";

const fetchNewData = async () => {
    const res = await fetch('http://localhost:3000/api/worker')
    const data = await res.json()
    return data
}

export default function Queue() {
    const router = useRouter();
    const [orders, setOrders] = useState(null)

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

    // component unmounts when the page changes
    useEffect(() => {
        fetchNewData().then((data) => {
            setOrders(data.data)
        })

        const interval = setInterval(() => {
            fetchNewData().then((data) => {
                setOrders(data.data)
            })
        }, 5000);
        return () => {
            clearInterval(interval)
        };
    }, []);

    return (
        <>
            <Head>
                <title>Orders</title>
                <meta
                    name="description"
                    content="An app to order coffee ahead of time"
                />
            </Head>
            <main className="max-w-screen-md mx-auto bg-gray-300 min-h-screen">
                <div className="bg-gray-100 p-4 flex flex-row items-center justify-between">
                    <h1 className="text-3xl">Orders</h1>
                    <h1>
                        <a href="/api/logout" onClick={async (e) => handleLogout(e)}>Logout</a>
                    </h1>
                </div>
                <div className="grid gap-4 grid-cols-1 mt-4 mx-4">
                    {orders && orders.map((item) => (
                        <Card order={item} key={item.id} status={item.orderStatus} instructions={item.instructions}></Card>
                    ))}
                </div>
            </main>
        </>
    );
}

Queue.getLayout = function getLayout(page) {
    return (
        <Worker>
            {page}
        </Worker>
    )
}