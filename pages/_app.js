import { SWRConfig } from "swr";
import fetchJson from "@/lib/fetchJson"
import "@/styles/globals.css";
import Layout from "@/layouts/layout";

export default function App({ Component, pageProps }) {
    // use <Layout /> as default layout
    const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>);

    return (
        <SWRConfig
            value={{
                fetcher: fetchJson,
                onError: (err) => {
                    console.error(err);
                },
            }}
        >
            {getLayout(<Component {...pageProps} />)}
        </SWRConfig>
    );
}
