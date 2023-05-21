import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const fetchNewData = async (id) => {
    const res = await fetch(`http://localhost:3000/api/worker/${id}`)
    const data = await res.json()
    return data.data;
}

export const Card = ({ order }) => {
    const [orderStatus, setOrderStatus] = useState(order.status)
    const [orderedAt, setOrderedAt] = useState(order.createdAt)
    const [orderForTime, setOrderForTime] = useState(order.orderTime)

    useEffect(() => {
        const updateStatus = setInterval(() => {
            fetchNewData(order.id).then((data) => {
                setOrderStatus(data.status)
            })
        }, 5000);
        return () => {
            clearInterval(updateStatus)
        };
    }, []);

    const handleClick = async (item) => {
        // this is where we need to change order status from uncompleted -> being made -> ready -> picked-up/Complete
        const currStatus = order.status

        if (currStatus == "cancelled") {
            toast.error("Order has been cancelled!")
            return;
        }

        let newStatus
        if (currStatus === "pending") {
            newStatus = "being made"
        } else if (currStatus === "being made") {
            newStatus = "ready"
        } else if (currStatus === "ready") {
            newStatus = "picked-up"
        } else {
            // flip the status back to pending
            newStatus = "pending"
        }

        const res = await fetch(`/api/worker/${item.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status: newStatus
            })
        }).then((res) => {
            if (res.status === 200) {
                setOrderStatus(newStatus)
                order.status = newStatus // this is just to update the state of the card - this is not the persisted part
                toast.success("Order updated successfully!")
            } else {
                toast.error("Something went wrong!")
            }
        })
    }

    // This handles an error with NextJS saying the client and server mismatch
    useEffect(() => {
        setOrderedAt(new Date(order.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/New_York"
        }));

        setOrderForTime(new Date(order.pickupAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "America/New_York"
        }));
    }, [])

    return (
        <>
            <div className="bg-orange-200 p-4 flex flex-row items-center">
                <div className="pr-2">
                    <div>
                        Order: {order.id}
                    </div>
                    <div>
                        {order.data.map((item) => { return `${item.title} (${item.size.substring(0, 1).toUpperCase() + item.size.slice(1)})` }).join(", ")}
                    </div>
                    <div>
                        Special Instructions: {order.data.map((item) => {
                            if (!item.instructions) {
                                return `${item.title} - None`
                            }
                            return `${item.title} - ${item.instructions}`
                        }).join(", ")}
                    </div>
                    <div>
                        Total: ${order.total}
                    </div>
                    <div>
                        Ordered at: {orderedAt} &emsp; Pick-up at: {orderForTime}
                    </div>
                </div>
                <div className="ml-auto">
                    <button className="bg-red-500 hover:bg-blue-700 text-white font-bold text-lg  px-2 rounded" onClick={() => handleClick(order)}>
                        {orderStatus && orderStatus.toUpperCase()}
                    </button>
                </div>
            </div>
        </>
    )
}