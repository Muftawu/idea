"use client"

import { useMemo, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts"
import { cn } from "@/lib/utils"

function Gauge({ value }: { value: string }) {
    const radius = 85
    const stroke = 16
    const circumference = 2 * Math.PI * radius
    const arc = (270 / 360) * circumference
    const offset = arc - (85/ 100) * arc

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
                {value}
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

export default function EnergyWidget({ className }: { className?: string }) {
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
            className={cn("rounded-2xl bg-card p-4 md:p-6 ring-1 ring-border", "grid md:grid-cols-2 gap-6", className)}
            aria-label="Energy control"
        >
            <div className="flex flex-col items-center justify-center">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-muted text-sm text-foreground">Current Academic Term</span>
                </div>
                <Gauge value="3rd" />

            </div>

            <div className="flex flex-col">
                <div className="flex flex-row justify-between items-center">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Term Starts</h3>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">Term Ends</h3>
                </div>

                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={bars} barCategoryGap={18}>
                            <XAxis
                                dataKey="d"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                            />
                            <YAxis hide />
                            <Bar dataKey="v" radius={[6, 6, 6, 6]}>
                                {bars.map((entry, i) => (
                                    <Cell key={i} fill={entry.fill as string} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-1 gap-3">
                    <button className="rounded-xl bg-muted py-2 text-sm">Next Vacation: {new Date().toLocaleDateString()}</button>
                    {/* <button className="rounded-xl bg-muted py-2 text-sm hidden">Schedule</button> */}
                    {/* <button className="rounded-xl bg-[var(--brand)] text-background py-2 text-sm hidden">Boost</button> */}
                </div>
            </div>
        </section>
    )
}
