import Head from "next/head";
import { useRouter } from "next/router";

export default function Menu({ menu }) {
    const router = useRouter();

    const handleClick = (item) => {
        // Redirect to the item modification page
        router.push(`/item/${item.id}`);
    }

    return (
        <>
            <Head>
                <title>Menu</title>
                <meta
                    name="description"
                    content="An app to order coffee ahead of time"
                />
            </Head>
            <div className="bg-gray-100 p-4">
                <h1 className="text-3xl">Menu</h1>
            </div>
            <div className="grid gap-4 grid-cols-2 mt-4 mx-4 pb-4">
                {menu && menu.map((item) => (
                    <div key={item.id} className="bg-orange-200 p-4 flex flex-row items-center">
                        <div className="pr-2">
                            {item.name} &middot; ${item.grandePrice}
                        </div>
                        <div className="ml-auto">
                            <button className="bg-red-500 hover:bg-red-700 text-white font-bold text-lg  px-2 rounded" onClick={() => handleClick(item)}>
                                Add
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export async function getStaticProps() {
    const menu = await fetch(`http://localhost:3000/api/menu`)
    const data = await menu.json()

    return {
        props: {
            menu: data.data
        },
    }
}