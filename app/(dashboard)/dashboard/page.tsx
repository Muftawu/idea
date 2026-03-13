"use client"
import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard"
import { StaffDashboard } from "@/components/dashboard/staff-dashboard"
import { AuthContext } from "@/context/authContext"
import { Spinner } from "@heroui/react"
import { useContext } from "react"

export default function Page() {

    const userData = useContext(AuthContext)
    if (!userData) return <Spinner />
    const userType = userData.userInfo.userType

    return userType === "admin" ? <AdminDashboard /> : <StaffDashboard />
}
