import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import React from "react";
import NextTopLoader from "nextjs-toploader";
import ReduxProvider from "./store/ReduxProvider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ENVR",
    description: "",
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        {process.env.NODE_ENV === 'test' ? (
            <head>
                {/*<Script src="/js/restrictDevTools.js" strategy="beforeInteractive"/>*/}
            </head>
        ) : null}
        <body className={`${inter.className} bg-white`}>
        <NextTopLoader
            color="#57cc99"
            initialPosition={0.08}
            crawlSpeed={200}
            height={4}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            template='<div class="bar" role="bar"><div class="peg"></div></div>'
            zIndex={1600}
            showAtBottom={false}
        />
        <ReduxProvider>
            {children}
        </ReduxProvider>
        </body>
        </html>
    );
}