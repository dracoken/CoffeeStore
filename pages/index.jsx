import Head from 'next/head'
import Link from 'next/link'
import useUser from '@/lib/useUser'
import fetchJson, { FetchError } from '@/lib/fetchJson'
import Guest from "@/layouts/guest"
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Home() {
    const [errorMsg, setErrorMsg] = useState("")

    const { mutateUser } = useUser({
        redirectTo: '/auth/routing',
        redirectIfFound: true,
    })

    const loginSubmit = async (e) => {
        e.preventDefault()

        const body = {
            email: e.target.email.value
        }

        try {
            mutateUser(
                await fetchJson("/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                }),
                false,
            );
        } catch (error) {
            if (error instanceof FetchError) {
                setErrorMsg(error.data.error);
                toast.error(error.data.error);
            } else {
                console.error("An unexpected error happened:", error);
            }
        }
    }
    return (
        <>
            <Head>
                <title>Coffee App</title>
                <meta name="description" content="An app to order coffee ahead of time" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <div className="text-center">
                <h1 className='text-3xl font-bold'>Coffee App</h1><br></br>
                <h2>Login to your Account</h2>
                <form className="flex flex-col mx-auto w-1/2 pt-4" onSubmit={(e) => loginSubmit(e)}>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                    <input type="email" id="email" placeholder="bilitski@pitt.edu" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />
                    {errorMsg && <p className="text-red-500 text-center underline">{errorMsg}</p>}
                    <button className="bg-blue-500 p-2 rounded-md text-white hover:bg-gray-400 mt-4">Login</button>
                </form>
                <div className="flex flex-col w-1/2 mx-auto mt-2">
                    <Link className="bg-gray-500 p-2 rounded-md text-white hover:bg-gray-400" href='/register'>Create new Account</Link>
                </div>
            </div>
        </>
    )
}

Home.getLayout = function getLayout(page) {
    return (
        <Guest>
            {page}
        </Guest>
    )
}