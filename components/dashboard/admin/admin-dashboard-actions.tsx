"use client"

import { useEffect, useRef, useState } from "react"
import { Alert, Button, Spinner } from "@heroui/react"
import { DownloadIcon } from "lucide-react"
import { ClassRoomSchemaT, StaffT, StudentSchemaT } from "@/lib/schemas"
import { toast } from "react-toastify"
import { BaseErrMsg } from "@/lib/utils"
import { AllStudentsPDFList } from "../reports/AllStudentsPDFList"
import { useSchoolContext } from "@/context/schoolContext"
import { usePDF } from "@react-pdf/renderer"


export function AdminDashboardActions() {

    const schoolData = useSchoolContext()

    const [loading, setLoading] = useState<boolean>(false)
    const [readyToDownload, setReadyToDownload] = useState<boolean>(false)
    const [downloadData, setDownloadData] = useState<(ClassRoomSchemaT | StudentSchemaT | StaffT)[]>([])

    const [instance, instanceUpdate] = usePDF({
        document: <AllStudentsPDFList
            academicTerm={schoolData?.schoolSettings.currentTerm ?? ""}
            academicYear={schoolData?.schoolSettings.currentTerm ?? ""}
            data={(downloadData as ClassRoomSchemaT[])}
        />
    })

    useEffect(() => {
        const fn = () => {
            if (!readyToDownload) return
            if (downloadData.length < 1) return toast.info("Preparing print data. Please wait")

            if (instance.loading) return
            if (!instance.url || instance.error) {
                toast.error(BaseErrMsg)
                setReadyToDownload(false)
                return
            }
            const link = document.createElement("a")
            link.download = "All Enrolled Students.pdf"
            link.href = instance.url
            link.click()
            setReadyToDownload(false)
            setLoading(false)
        }
        fn()
    }, [readyToDownload, instance.loading, instance.url, instance.error])

    if (!schoolData?.schoolSettings) return null

    const handlePrintAction = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/classes?query=all`, {
                method: "GET"
            })
            const result = await response.json()
            if (!response.ok) return toast.info(BaseErrMsg)
            else {
                const data = result.data as ClassRoomSchemaT[]
                instanceUpdate(
                    <AllStudentsPDFList
                        academicTerm={schoolData.schoolSettings.currentTerm}
                        academicYear={schoolData.schoolSettings.academicYear}
                        data={data}
                    />
                )
                setDownloadData(result.data)
                setReadyToDownload(true)
                toast.success("Successfully downloaded PDF Data")
            }
        } catch (err: any) {
            toast.error(BaseErrMsg)
        }
    }

    const quickActions = [
        {
            "slug": "classes",
            "title": "Export Students",
            "description": "Download PDF list of all students",
        },
    ]

    return (
        <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">

            <h1 className="mb-4">Quick Admin Actions</h1>

            {quickActions.map((item, index) => (
                <div key={index} className="flex items-start justify-between">
                    <div className="flex items-center justify-center w-full mb-4">
                        <Alert
                            color="default"
                            description="Download PDF list of all students"
                            endContent={
                                <Button
                                    isIconOnly
                                    color="primary"
                                    onPress={() => handlePrintAction()}
                                    isLoading={loading}
                                >
                                    <DownloadIcon />
                                </Button>
                            }
                            title={item.title}
                            variant="faded"
                        />
                    </div>

                </div>
            ))}
        </section>
    )
}

