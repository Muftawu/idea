"use client"

import { WelcomeCard } from "@/components/dashboard/welcome-card"
import { StaffDashboardActions } from "@/components/dashboard/staff/staff-dashboard-actions"
import { StaffHomeStatistics } from "@/components/dashboard/staff/staff-home-stats"
import { useContext, useState } from "react"
import { AuthContext } from "@/context/authContext"
import { Spinner } from "@heroui/react"

export const StaffDashboard = () => {

    const userData = useContext(AuthContext)

    if (!userData || !userData.userInfo) return null

    return (
        <div className="lg:h-dvh h-auto overflow-auto scrollbar-hide space-y-5">
            <WelcomeCard />

            <div className="grid gap-5 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <section className="grid grid-cols-1 gap-4 md:grid-cols-1">
                        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-foreground">Statistics</h2>
                            </div>
                            <StaffHomeStatistics userInfo={userData.userInfo} />
                        </div>
                    </section>
                </div>

                <div className="space-y-5">
                    <StaffDashboardActions userInfo={userData.userInfo} />
                </div>
            </div>

        </div>
    )
}

