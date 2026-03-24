"use client"
import { DownloadIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@heroui/react";
import { usePDF } from "@react-pdf/renderer";
import { RecordNumberPackage } from "@/components/dashboard/reports/reportSchema"
import { AcademicReportNumber } from "@/components/dashboard/reports/AcademicRecordNumber"

export default function ReportDownloadButton({ 
    fileName,
    onBeforeDownload  
}: { 
    fileName: string,
    onBeforeDownload: () => RecordNumberPackage | null
}) {
    const [pendingData, setPendingData] = useState<RecordNumberPackage | null>(null)
    
    const [instance, updateInstance] = usePDF({
        document: <AcademicReportNumber data={pendingData!} />
    })

    // When pendingData changes, update the PDF instance
    useEffect(() => {
        if (pendingData) {
            updateInstance(<AcademicReportNumber data={pendingData} />)
        }
    }, [pendingData])

    // When PDF finishes generating after a click, trigger download
    useEffect(() => {
        if (pendingData && !instance.loading && instance.url) {
            const link = document.createElement("a")
            link.href = instance.url
            link.download = `${fileName}.pdf`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setPendingData(null) // reset
        }
    }, [pendingData, instance.loading, instance.url])

    const handleClick = () => {
        const data = onBeforeDownload()
        if (data) {
            setPendingData(data)
        }
    }

    return (
        <Button 
            color="primary" 
            isIconOnly={true} 
            isLoading={!!pendingData && instance.loading}
            onPress={handleClick}
        >
            {!(pendingData && instance.loading) && <DownloadIcon />}
        </Button>
    )
}
