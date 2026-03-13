import { WelcomeCard } from "@/components/dashboard/welcome-card"
import { RoomCard } from "@/components/dashboard/room-card"
import { DeviceCard } from "@/components/dashboard/device-card"
import { StaffDashboardActions } from "@/components/dashboard/air-conditioning"
import { UsersWidget } from "@/components/dashboard/users"
import { ConsumptionChart } from "@/components/dashboard/consumption-chart"
import { Shortcuts } from "@/components/dashboard/shortcuts"
import { LightPanels } from "@/components/dashboard/light-panels"
import EnergyWidget from "@/components/dashboard/energy-widget"
import { StaffHomeStatistics } from "@/components/dashboard/staff-home-stats"

export const StaffDashboard = () => {
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
                            <StaffHomeStatistics  />
                        </div>
                    </section>
                </div>

                <div className="space-y-5">
                    <StaffDashboardActions />
                </div>
            </div>

        </div>
    )
}

