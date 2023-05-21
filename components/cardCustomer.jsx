import { logDOM } from '@testing-library/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const fetchNewData = async (id) => {
  const res = await fetch(`http://localhost:3000/api/order/${id}`)
  const data = await res.json()
  return data
}

export const CardCustomer = ({ order }) => {
  const [orderStatus, setOrderStatus] = useState(order.status)
  const [orderedAt, setOrderedAt] = useState(order.createdAt)
  const [orderForTime, setOrderForTime] = useState(order.pickupAt)

  useEffect(() => {
    const statusEffect = setInterval(() => {
      fetchNewData(order.id).then((data) => {
        setOrderStatus(data.data.status)
      })
    }, 5000);
    return () => {
      clearInterval(statusEffect)
    };
  }, []);

  //This is where we deleate items from the order JSON file and then reupdate the page to show that an order has been deleated on both the customer side and worker side
  //it will do this by deleating the index of the order inside the json file
  const cancelOrder = async (item) => {
    const createdAt = new Date(order.createdAt).getTime()
    const now = new Date().getTime()

    if ((now - createdAt) > (5 * 60 * 1000)) {
      toast.error("Your order can no longer be cancelled!")
      return;
    }

    const res = await fetch(`/api/order/${item.id}`, {
      method: "PATCH",
      headers:
      {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "cancelled"
      })
    }).then((res) => {
      if (res.status === 200) {
        setOrderStatus("cancelled")
        order.status = "cancelled" // this is just to update the state of the card - this is not the persisted part
        toast.success("Order has been cancelled successfully!")
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
          <button className="bg-red-300 hover:bg-green-500 text-white font-bold text-lg px-2 rounded" onClick={() => cancelOrder(order)}>X</button>
          <div>
            Order: {order.id}
          </div>
          <div>
          {JSON.parse(JSON.stringify(order.data)).map((item) => { return `${item.title} (${item.size.substring(0, 1).toUpperCase() + item.size.slice(1)})` }).join(", ")}
          </div>
          <div>
            Total: ${order.total.toFixed(2)}
          </div>
          <div>
            Ordered at: {orderedAt} &emsp; Pick-up at: {orderForTime}
          </div>
        </div>
        <div className="ml-auto">
          <button className="bg-red-500 hover:bg-blue-700 text-white font-bold text-lg  px-2 rounded">
            {orderStatus.toUpperCase()}
          </button>
        </div>
      </div>
    </>
  )
}