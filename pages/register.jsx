import Head from "next/head";
import React from "react";
import Guest from "@/layouts/guest"
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function Register() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [worker, setWorker] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const registerAccount = async (e) => {
        e.preventDefault();
        console.log("Registering account with email: " + email + " and worker: " + worker);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                worker: worker,
            }),
        });

        const data = await res.json();
        console.log(data);

        if (data.error) {
            toast.error("Error registering account");
            setErrorMsg("Error registering account");
        } else {
            toast.success("Account registered successfully");
            router.push("/");
        }
    }

    return (
        <>
            <Head>
                <title>Register</title>
                <meta
                    name="description"
                    content="An app to order coffee ahead of time"
                />
            </Head>
            <div className=" pt-2">
                <h1 className="text-2xl text-center uppercase underline">Register a New Account</h1>
                <div>
                    <form className="flex flex-col mx-auto w-1/2 pt-4" onSubmit={(e) => registerAccount(e)}>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                        <input type="email" id="email" onChange={e => setEmail(e.target.value)} placeholder="bilitski@pitt.edu" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" />

                        <div className="flex items-start mb-6 mt-4">
                            <div className="flex items-center h-5">
                                <input type="checkbox" id="worker" onChange={e => setWorker(e.target.checked)} className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"></input>
                            </div>
                            <label htmlFor="worker" className="ml-2 text-sm font-medium text-gray-900">Are you a worker?</label>
                        </div>
                        <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Register new account</button>
                    </form>
                    {errorMsg && <p className="text-red-500 text-center underline">{errorMsg}</p>}
                </div>
            </div>
        </>
    );
}

Register.getLayout = function getLayout(page) {
    return (
        <Guest>
            {page}
        </Guest>
    )
}