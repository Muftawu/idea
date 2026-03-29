"use client"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { NonTeachingStaffSchemaT, StaffStatSchemaT, StaffT } from "@/lib/schemas"
import { Alert, Spinner } from "@heroui/react"
import { useSchoolContext } from "@/context/schoolContext"

const StaffPDFDownloadWrapper = dynamic(() => import("../wrappers/StaffPDFDownloadWrapper"), {
    ssr: false,
    loading: () => <Spinner size="sm" />
})


// const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), { ssr: false })
// const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false })
// const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false })
// const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false })
// const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false })
// const Cell = dynamic(() => import("recharts").then(mod => mod.Cell), { ssr: false })

function Gauge({ value }: { value: number }) {
    const radius = 85
    const stroke = 16
    const circumference = 2 * Math.PI * radius
    const arc = (270 / 360) * circumference
    const offset = arc - (value / 100) * arc

    return (
        <svg viewBox="0 0 220 220" className="h-56 w-56">
            <g transform="translate(110,110) rotate(225)">
                <circle
                    r={85}
                    className="stroke-muted"
                    strokeWidth={stroke}
                    strokeDasharray={`${arc} ${circumference}`}
                    fill="none"
                />
                <circle
                    r={85}
                    className="stroke-[var(--brand)]"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={`${arc} ${circumference}`}
                    strokeDashoffset={offset}
                    fill="none"
                />
            </g>
            <text
                x="50%"
                y="52%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="fill-foreground text-3xl font-semibold"
            >
                {value}%
            </text>
        </svg>
    )
}


export default function StaffStatistics({ className, datatype, statdata, printdata }: { className?: string, datatype?: string, statdata: StaffStatSchemaT, printdata?: (NonTeachingStaffSchemaT | StaffT)[] }) {
    const schoolData = useSchoolContext()
    if (!schoolData?.schoolSettings) return 

    return (
        <section
            className={cn("rounded-2xl bg-card p-4 md:p-6 ring-1 ring-border", "grid md:grid-cols-3 gap-6", className)}
            aria-label="Energy control"
        >
            <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-muted text-lg text-foreground">{statdata.maleCount}</span>
                </div>
                <Gauge value={statdata.malePercentage} />
                <div className="mt-4 w-full">
                    <p className="mt-1 text-center text-lg text-muted-foreground">Male Staff</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-muted text-lg text-foreground">{statdata.femaleCount}</span>
                </div>
                <Gauge value={statdata.femalePercentage} />
                <div className="mt-4 w-full">
                    <p className="mt-1 text-center text-lg text-muted-foreground">Female Staff</p>
                </div>
            </div>


            <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Last days</h3>
                <div className="h-40">
                    <div className="flex items-center justify-center w-full mb-4">
                        <Alert
                            color="default"
                            description={`Download PDF List`}
                            endContent={
                                <StaffPDFDownloadWrapper
                                    datatype={datatype}
                                    printdata={printdata}
                                    currentTerm={schoolData.schoolSettings.currentTerm}
                                    academicYear={schoolData.schoolSettings.academicYear}
                                />
                            }
                            title={`Export ${datatype} data`}
                            variant="faded"
                        />
                    </div>
                </div>
            </div>

        </section>
    )
}
