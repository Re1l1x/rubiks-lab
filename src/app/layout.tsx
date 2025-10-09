import type { Metadata } from "next";
import { Red_Hat_Text } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import Header from "@/components/Header/Header";
import "@/styles/globals.css";

const redhattext = Red_Hat_Text({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "rubiks lab",
    description: "cubik rubik",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={redhattext.className}>
                <ThemeProvider>
                    <Header />
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
