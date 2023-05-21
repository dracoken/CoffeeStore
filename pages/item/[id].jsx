import Head from "next/head";
import { toast } from "react-toastify";
import MenuData from "../../data/menu";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

export const addToCart = (item, size, specialInstructions) => {
    let cart = [];

    // check if cart exists
    if (localStorage.getItem("cart") != null) {
        // load the cart from local storage
        cart = JSON.parse(localStorage.getItem("cart"));
    }

    //random id
    item.id = Math.floor(Math.random() * 1000000000); // random id to avoid duplicates

    const newItem = {
        id: item.id,
        title: item.name,
        price: size === "grande" ? item.grandePrice : item.ventiPrice,
        size: size,
        instructions: specialInstructions,
    }
    //after adding the instructions attribute to the new item, it didn't break it but im not sure if it is acutally being read
    //if the value for instructions inside the newItem matrix is not null then it will be saved to the orders.json

    // add item to cart
    cart.push(newItem);

    // save cart
    localStorage.setItem("cart", JSON.stringify(cart));
}

export default function Item({ item }) {
    let router = useRouter();
    const [size, setSize] = useState("grande")
    const [specialInstructions, setSpecialInstructions] = useState("")

    const handleClick = () => {
        console.log(item.title + " for $" + item.price + " clicked! (" + item.id + ")");
        addToCart(item, size, specialInstructions);
        toast.success("Item added to cart")
        router.push("/menu");
    }

    const textAreaUpdate = () => {
        console.log("inside textAreaUpdate");
        instructValue = document.getElementById("instruct").value;
    }

    return (
        <>
            <Head>
                <title>Modify Your Drink</title>
            </Head>
            <div className="bg-gray-100 p-4 flex flex-row justify-between items-center">
                <Link href="/menu" className="hover:bg-gray-300 rounded-md p-1 -ml-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z" clipRule="evenodd" />
                    </svg>
                </Link>
                <h1 className="text-3xl">Modify &middot; {item.name}</h1>
                {/* This is here to keep the flex spacing  */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"></svg>
            </div>
            <div className="mt-4 mx-4 pb-4">
                <div className="bg-orange-200 p-4 flex flex-col">
                    <div className="flex flex-col">
                        <Image src={`/coffeeimgs/${item.name}.webp`} width={500} height={500} alt={item.name} className="self-center justify-self-center max-w-xs max-h-xs"></Image>
                        <label htmlFor="size" className="block mb-2 text-sm font-medium text-gray-900">Choose a size</label>
                        <select name="size" id="size" onChange={e => setSize(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                            <option value="grande">Grande - ${item.grandePrice}</option>
                            <option value="venti">Venti - ${item.ventiPrice}</option>
                        </select>
                        <form className="py-1">
                            <label htmlFor="instruct" id="test">Specical Requests for preperation</label>
                            <div className="h-200 py-2">
                                <textarea rows="5" type="text" id="instruct" name="instruct" placeholder="i.e don't add milk to drink" onChange={(e) => setSpecialInstructions(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="mt-4">
                        <button className="flex justify-center w-full bg-red-500 hover:bg-red-600 p-4 text-white rounded-lg" onClick={handleClick}>
                            Add To Cart
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 ml-[0.25rem]">
                                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export async function getServerSideProps(context) {
    const id = context.params.id

    const item = await fetch(`http://localhost:3000/api/menu/${id}`)
    const data = await item.json()

    return {
        props: {
            item: data.data
        }
    }
}