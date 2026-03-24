"use client"
import { AdminStatsSchemaT, ClassRoomSchemaT, MinimalStudentInfoSchemaT, UserSchemaT } from "@/lib/schemas"
import { BaseRequestHeaders } from "@/lib/utils"
import { Spinner } from "@heroui/react"
import { Sunrise, Moon, Database } from "lucide-react"
import { useEffect, useState } from "react"

type dataProps = {
    icon: any
    title: string,
    data: string | number,
}

function HomeStatCard({ icon: Icon, title, data }: dataProps) {
    return (
        <div className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-sm ring-1 ring-border">
            <span aria-hidden className="grid size-8 place-items-center rounded-xl bg-brand text-white">
                <Icon className="size-4" />
            </span>
            <div>
                <div className="text-xl font-semibold text-foreground">{data}</div>
                <div className="text-lg text-muted-foreground">{title}</div>
            </div>
        </div>
    )
}

export function StaffHomeStatistics({ userInfo }: { userInfo: UserSchemaT }) {
    const [classCount, setClassCount] = useState<number>(0)
    const [studentTotal, setStudentTotal] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        if (!userInfo.userTypeId || userInfo.userTypeId.trim().length < 1) return
        const fetchStaffDetails = async () => {
            try {
                const response = await fetch(`/api/staff?query=${userInfo.userTypeId}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    setLoading(false)
                    return null
                } else {
                    let total = 0
                    result.data.assignedClasses.reduce((acc: any, val: ClassRoomSchemaT) => {
                        total = acc + val.studentCount
                        return total
                    }, total)
                    setStudentTotal(total)
                    setClassCount(result.data.assignedClasses.length ?? 0)
                    setLoading(false)
                }
            } catch (err: any) {
                setLoading(false)
            }
        }
        fetchStaffDetails()
    }, [userInfo.userTypeId])

    const data: dataProps[] = [
        {
            title: "Student Total",
            data: studentTotal,
            icon: Sunrise
        },
        {
            title: "Class Total",
            data: classCount,
            icon: loading ? Sunrise : Spinner
        },
    ]
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-2">
            {data.map((item, index) => (
                <HomeStatCard key={index} icon={Sunrise} title={item.title} data={item.data} />
            ))}
        </div>
    )
}
