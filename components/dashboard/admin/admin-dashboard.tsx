"use client"
import { WelcomeCard } from "@/components/dashboard/welcome-card"
import { DeviceCard } from "@/components/dashboard/device-card"
import { AdminDashboardActions } from "@/components/dashboard/admin/admin-dashboard-actions"
import { ConsumptionChart } from "@/components/dashboard/consumption-chart"
import EnergyWidget from "@/components/dashboard/energy-widget"
import { AdminHomeStatistics } from "@/components/dashboard/admin/admin-home-stats"
import { useEffect, useState } from "react"
import { AdminStatsSchemaT, StudentSchemaT } from "@/lib/schemas"
import { BaseRequestHeaders } from "@/lib/utils"

export function AdminDashboard() {

    const [students, setStudents] = useState<StudentSchemaT[]>([])
    const [adminStats, setAdminStats] = useState<AdminStatsSchemaT>({
        totalClasses: 0,
        totalStudents: 0,
        totalStaff: 0,
    })

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const response = await fetch(`/api/stats?query=admin`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    setAdminStats(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchAdminStats()
    }, [])

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`/api/students?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    setStudents(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchStudents()
    }, [])

    return (
        <div className="lg:h-dvh h-auto space-y-5">
            <WelcomeCard />

            <div className="grid gap-5 lg:grid-cols-3">
                <div className="space-y-5 lg:col-span-2">
                    <section className="grid grid-cols-1 gap-4 md:grid-cols-1">
                        <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">
                            <div className="mb-3 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-foreground">Statistics</h2>
                            </div>
                            <AdminHomeStatistics adminData={adminStats} />
                        </div>
                    </section>

                    <EnergyWidget />
                </div>

                <div className="space-y-5">
                    <AdminDashboardActions data={students} />
                </div>
            </div>


        </div>
    )
}
