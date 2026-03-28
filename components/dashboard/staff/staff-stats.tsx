"use client"

import dynamic from "next/dynamic"
import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import { NonTeachingStaffSchemaT, StaffStatSchemaT, StaffT } from "@/lib/schemas"
import { Alert, Button, Spinner } from "@heroui/react"
import { DownloadIcon } from "lucide-react"
import { useSchoolContext } from "@/context/schoolContext"

const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink),
    { ssr: false, loading: () => <Spinner size="sm" /> }
)
const AllNonTeachingStaffPDFList = dynamic(
    () => import("../reports/AllNonTeachingStaffPDFList").then(mod => mod.AllNonTeachingStaffPDFList),
    { ssr: false }
)
const AllTeachingStaffPDFList = dynamic(
    () => import("../reports/AllTeachingStaffPDFList").then(mod => mod.AllTeachingStaffPDFList),
    { ssr: false }
)


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

const lastDays = [
    { d: "18", v: 18 },
    { d: "19", v: 15 },
    { d: "20", v: 28 },
    { d: "21", v: 12 },
    { d: "22", v: 40 }, // accent bar
    { d: "23", v: 20 },
    { d: "24", v: 30 },
    { d: "25", v: 18 },
]

export default function StaffStatistics({ className, datatype, statdata, printdata }: { className?: string, datatype?: string, statdata: StaffStatSchemaT, printdata?: (NonTeachingStaffSchemaT | StaffT)[] }) {
    const schoolData = useSchoolContext()
    if (!schoolData?.schoolSettings) return

    const [value, setValue] = useState(65)

    const bars = useMemo(
        () =>
            lastDays.map((x, i) => ({
                ...x,
                fill: i === 4 ? "var(--brand)" : "var(--muted-foreground)",
            })),
        [],
    )

    const trackBg = useMemo(
        () => `linear-gradient(var(--brand), var(--brand)) 0/ ${value}% 100% no-repeat, var(--muted)`,
        [value],
    )

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
                                datatype === "teaching-staff" ?
                                    <PDFDownloadLink
                                        document={<AllTeachingStaffPDFList academicTerm={schoolData.schoolSettings.currentTerm} academicYear={schoolData.schoolSettings.currentTerm} data={(printdata as StaffT[])} />}
                                        fileName={`All_Teaching_Staff_${new Date().toDateString()}`}>
                                        {({ blob, url, loading, error }) =>
                                            loading ? <Spinner size="sm" /> :
                                                <div className="flex flex-row justify-center items-center">
                                                    <Button color="primary" isIconOnly={true}>
                                                        <DownloadIcon />
                                                    </Button>
                                                </div>
                                        }
                                    </PDFDownloadLink>
                                    :
                                    <PDFDownloadLink
                                        document={<AllNonTeachingStaffPDFList academicTerm={schoolData.schoolSettings.currentTerm} academicYear={schoolData.schoolSettings.currentTerm} data={(printdata as NonTeachingStaffSchemaT[])} />}
                                        fileName={`All_NonTeaching_Staff_${new Date().toDateString()}`}>
                                        {({ blob, url, loading, error }) =>
                                            loading ? <Spinner size="sm" /> :
                                                <div className="flex flex-row justify-center items-center">
                                                    <Button color="primary" isIconOnly={true}>
                                                        <DownloadIcon />
                                                    </Button>
                                                </div>
                                        }
                                    </PDFDownloadLink>
                                // <Button isIconOnly={false} color="warning" size="sm" variant="flat">
                                //     <DownloadIcon />
                                // </Button>
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
