import React from "react";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const worker = ({ children }) => {
  return (
    <>
      <main className="max-w-screen-md mx-auto bg-gray-300 min-h-screen">
        {children}
        <ToastContainer position="bottom-right" className="" />
      </main>
      <footer className="max-w-screen-md mx-auto bg-gray-500 sticky bottom-0">
        <div className="flex flex-row justify-center text-white p-2">
          <div className="h-12 w-12">
            <Link href="/">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default worker;
