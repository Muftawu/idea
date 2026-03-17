"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Topbar } from "@/components/topbar"
import { HeroUIProvider } from "@heroui/react";
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "@/context/authContext"
import { SchoolProvider } from "@/context/schoolContext"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (

        <div className="bg-background h-screen" data-brand="orange">

            <div className="mx-auto px-0 py-0">
                <div className="bg-shadow-sm ring-0 ring-border overflow-hidden">
                    {sidebarOpen && (
                        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
                    )}

                    <div className="flex">
                        <div
                            className={`
              fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto
              transform transition-transform duration-300 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
                        >
                            <Sidebar />
                            {/* <Sidebar onClose={() => setSidebarOpen(false)} /> */}
                        </div>

                        <main className="flex-1 w-full lg:w-auto rounded-b-3xl lg:rounded-r-3xl lg:rounded-bl-none bg-muted p-3 sm:p-5 md:px-7 md:py-7 xl:pb-7 xl:pt-0 overflow-hidden">
                            <Topbar onMenuClick={() => setSidebarOpen(true)} />
                            <ToastContainer />
                            <HeroUIProvider>
                                <AuthProvider>
                                    <SchoolProvider>
                                    {children}
                                    </SchoolProvider>
                                </AuthProvider>
                            </HeroUIProvider>
                        </main>
                    </div>
                </div>
            </div>

        </div>
    )
}
