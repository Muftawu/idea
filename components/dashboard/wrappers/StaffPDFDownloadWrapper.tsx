"use client"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { Spinner, Button } from "@heroui/react"
import { DownloadIcon } from "lucide-react"
import { AllNonTeachingStaffPDFList } from "../reports/AllNonTeachingStaffPDFList"
import { AllTeachingStaffPDFList } from "../reports/AllTeachingStaffPDFList"
import { NonTeachingStaffSchemaT, StaffT } from "@/lib/schemas"

export default function StaffPDFDownloadWrapper({ datatype, printdata, currentTerm, academicYear }: {
    datatype?: string,
    printdata?: (NonTeachingStaffSchemaT | StaffT)[],
    currentTerm: string
    academicYear: string
}) {
    return datatype === "teaching-staff" ? (
        <PDFDownloadLink
            document={<AllTeachingStaffPDFList academicTerm={currentTerm} academicYear={academicYear} data={(printdata as StaffT[])} />}
            fileName={`All_Teaching_Staff_${new Date().toDateString()}`}>
            {({ loading }) =>
                loading ? <Spinner size="sm" /> :
                    <Button color="primary" isIconOnly={true}><DownloadIcon /></Button>
            }
        </PDFDownloadLink>
    ) : (
        <PDFDownloadLink
            document={<AllNonTeachingStaffPDFList academicTerm={currentTerm} academicYear={currentTerm} data={(printdata as NonTeachingStaffSchemaT[])} />}
            fileName={`All_NonTeaching_Staff_${new Date().toDateString()}`}>
            {({ loading }) =>
                loading ? <Spinner size="sm" /> :
                    <Button color="primary" isIconOnly={true}><DownloadIcon /></Button>
            }
        </PDFDownloadLink>
    )
}
