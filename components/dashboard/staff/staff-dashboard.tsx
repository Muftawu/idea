"use client"

import { WelcomeCard } from "@/components/dashboard/welcome-card"
import { StaffDashboardActions } from "@/components/dashboard/staff/staff-dashboard-actions"
import { StaffHomeStatistics } from "@/components/dashboard/staff/staff-home-stats"
import { useContext, useState } from "react"
import { AuthContext } from "@/context/authContext"
import { Spinner } from "@heroui/react"
import { useSchoolContext } from "@/context/schoolContext"

export const StaffDashboard = () => {

    const schoolSettings = useSchoolContext()
    const userData = useContext(AuthContext)

    if (!schoolSettings || !schoolSettings.schoolSettings) return null
    if (!userData || !userData.userInfo) return null

    return (
        <div className="lg:h-dvh h-auto overflow-auto scrollbar-hide space-y-5">

            {schoolSettings.schoolSettings.staffPortalStatus === "Closed" ?

                <>
                        <section className="relative overflow-hidden rounded-3xl bg-sidebar-gradient p-6 text-white">
                            <div className="flex gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-row justify-start items-center w-full">
                                    <h1 className="text-center text-3xl font-semibold">Sorry, staff portal has been closed by Admin.</h1>
                                </div>
                            </div>

                            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
                        </section>
                </>

                :

                <>
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
                </>
            }
        </div>
    )
}

