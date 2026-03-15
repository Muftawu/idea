"use client"
import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard"
import { StaffDashboard } from "@/components/dashboard/staff/staff-dashboard"
import { AuthContext } from "@/context/authContext"
import { useContext } from "react"

export default function Page() {

    const userData = useContext(AuthContext)

    if (!userData || !userData.userInfo) return

    const userType = userData.userInfo.userType

    return userType === "admin" ? <AdminDashboard /> : <StaffDashboard />
}
