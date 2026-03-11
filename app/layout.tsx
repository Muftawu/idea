"use client"
import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import { ToastContainer } from 'react-toastify';
import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "@/context/authContext"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${GeistSans.variable} ${GeistMono.variable} antialiased mx-0 start`}
            data-brand="orange"
        >
            <body className="font-sans">
                <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                    <AuthProvider >
                        <Suspense fallback={null}>
                            <ToastContainer />
                            <HeroUIProvider>
                                {children}
                            </HeroUIProvider>
                            <Analytics />
                        </Suspense>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html >
    )
}
