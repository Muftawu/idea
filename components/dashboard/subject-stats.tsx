"use client"
import { SubjectStatsSchemaT } from "@/lib/schemas"
import { ClassGroups } from "@/lib/utils"
import { Boxes, List, Notebook, Sunrise } from "lucide-react"

type dataProps = {
    icon: any
    title: string,
    data: string | number,
}

function SubjectStatCard({ icon: Icon, title, data }: dataProps) {
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

export function SubjecStatistics({ data }: { data: SubjectStatsSchemaT }) {
    const subjectStats: dataProps[] = [
        {
            title: "Class Groups",
            data: ClassGroups.length.toString(),
            icon: Boxes
        },
        {
            title: "Subjects",
            data: Number(data.subjectsCount).toFixed(0),
            icon: Notebook
        },
    ]
    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {subjectStats.map((item, index) => (
                <SubjectStatCard key={index} icon={item.icon} title={item.title} data={item.data} />
            ))}
        </div>
    )
}
