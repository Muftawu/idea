"use client"

import { useState } from "react"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { Alert, Button } from "@heroui/react"
import { Sunrise, DownloadIcon } from "lucide-react"

export function AdminDashboardActions() {

    const quickActions = [
        {
            "title": "Students list download",
            "description": "Download PDF list of all students"

        },
        {
            "title": "Staff list download",
            "description": "Download PDF list of all staff"
        }
    ]

    return (
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">

            <h1 className="mb-4">Quick Admin Actions</h1>

            {quickActions.map((item, index) => (
                <div key={index} className="flex items-start justify-between">
                    <div className="flex items-center justify-center w-full mb-4">
                        <Alert
                            color="default"
                            description="Download PDF list of all Students"
                            endContent={
                                <Button isIconOnly={false} color="warning" size="sm" variant="flat">
                                    <DownloadIcon />
                                </Button>
                            }
                            title="PDF Student List"
                            variant="faded"
                        />
                    </div>

                </div>
            ))}
        </section>
    )
}
