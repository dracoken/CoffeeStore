import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { calcTotal } from '.'
import { sessionOptions } from "@/lib/session";
import { withIronSessionSsr } from "iron-session/next";
import fetchJson from "@/lib/fetchJson";

export const placeOrder = async (order_data, orderTime, price, user) => {
    const res = await fetch("/api/order/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            order_data: order_data,
            orderTime: orderTime,
            price: price,
            user: user
        })
    })

    return res
}

export default function Checkout({ user, times }) {
    const router = useRouter()
    const [time, setTime] = useState(times[0].value)

    // post the order to the API
    const handleClick = async () => {
        const cart = JSON.parse(localStorage.getItem("cart"));
        const total = calcTotal(cart);

        if (cart.length === 0) {
            toast.error("You have no items in your cart!")
            return;
        }

        const res = await placeOrder(cart, time, total, user)

        if (res.status === 200) {
            toast.success("Order placed successfully!")
            localStorage.removeItem("cart")
            router.push("/orderHistory")
        } else {
            toast.error("Something went wrong!")
        }
    }

    return (
        <>
            <Head>
                <title>Modify Your Drink</title>
            </Head>
            <div className="bg-gray-100 p-4 flex flex-row justify-between items-center">
                <Link href="/cart" className="hover:bg-gray-300 rounded-md p-1 -ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                    </svg>
                </Link>
                <h1 className="text-3xl">Schedule Pickup</h1>
                {/* This is here to keep the flex spacing  */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"></svg>
            </div>
            <div className="mt-4 mx-4 pb-4">

                <div className="bg-orange-200 p-4 flex flex-col">
                    <div>
                        <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900">Choose a time</label>
                        <select id="time" name="time" onChange={e => setTime(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            {times.map((time) => (
                                <option key={time.value} value={time.value}>{time.time}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4">
                        <button className="w-full bg-red-500 hover:bg-red-600 p-4 text-white rounded-lg" onClick={handleClick}>
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export function getTimes() {
    let times = [];
    let time = new Date();
    // round to nearest 5 minutes
    time.setMinutes((Math.ceil(time.getMinutes() / 5) * 5) + 15);
    time.setSeconds(0);
    time.setMilliseconds(0);

    for (let i = 0; i < 24; i++) {
        let timeString = time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/New_York"
        });
        times.push({ time: timeString, value: time.toISOString() });
        time.setMinutes(time.getMinutes() + 5);
    }

    return times;
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
    
    const times = getTimes();

    return {
        props: {
            user: user,
            times: times,
        }
    }
}, sessionOptions)