"use client"

import { useEffect, useState } from "react"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { Alert, Button, Spinner } from "@heroui/react"
import { Sunrise, DownloadIcon } from "lucide-react"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { StudentSchemaT } from "@/lib/schemas"
import { StudentPDFList } from "../reports/student_pdf_list"
import { toast } from "react-toastify"
// import { ReportCard, sampleReportData } from "../reports/Adm"


export function AdminDashboardActions({ data }: { data: StudentSchemaT[] }) {

    const quickActions = [
        {
            "title": "Students list download",
            "description": "Download PDF list of all students",
            "component": StudentPDFList,
        },
        {
            "title": "Staff list download",
            "description": "Download PDF list of all staff",
            "component": StudentPDFList,
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
                                    <Button onPress={() => toast.info("Preparing print data. Please wait...")} isIconOnly={false} color="warning" size="sm" variant="flat">
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


{/* <PDFDownloadLink */ }
{/*     document={<item.component data={sampleReportData} />} */ }
{/*     fileName={`Student List_${new Date().toDateString()}`}> */ }
{/*     {({ blob, url, loading, error }) => */ }
{/*         loading ? <Spinner size="sm" /> : */ }
{/*             <div className="flex flex-row justify-center items-center"> */ }
{/*                 <Button disabled={true} color="primary" isIconOnly={true}> */ }
{/*                     <DownloadIcon /> */ }
{/*                 </Button> */ }
{/*             </div> */ }
{/*     } */ }
{/* </PDFDownloadLink> */ }

