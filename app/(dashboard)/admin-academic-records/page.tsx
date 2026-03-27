"use client"
import { PlusCircle, EyeIcon, Edit, BookText, TrashIcon, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { ClassSubjectGroupT, StudentSchemaT, SubjectStatsSchemaT } from "@/lib/schemas"
import { Input, Select, SelectItem, Button, Alert, addToast } from "@heroui/react";
import { Separator } from "@/components/ui/separator"
import { SubjecStatistics } from "@/components/dashboard/subject-stats"
import { BaseErrMsg, BaseRequestHeaders } from "@/lib/utils"
import { toast } from "react-toastify"
import { Spinner } from "@heroui/react"

export default function AdminAcademicRecords() {

    const [loading, setLoading] = useState<boolean>(false)

    const [isStudentsReady, setIsStudentsReady] = useState<boolean>(false)
    const [allStudents, setAllStudents] = useState<StudentSchemaT[]>([])
    const [studentInfo, setStudentInfo] = useState<StudentSchemaT>({
        surname: "",
        otherNames: "",
        dateOfBirth: new Date(),
        placeOfBirth: "",
        gender: "",
        nationality: "",
        schoolsAttended: "",
        healthProblems: "",
        age: 0,
        currentClass: { id: "", name: "" },
        guardianId: "",
        religion: "",
    })

    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const response = await fetch(`/api/students?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    setIsStudentsReady(true)
                } else {
                    setAllStudents(result.data)
                    setIsStudentsReady(true)
                }
            } catch (err: any) {
                setIsStudentsReady(true)
            }
        }
        fetchAllStudents()
    }, [])

    const handleNavigateToRecordsPage = (studentId?: string) => {
        if (!studentId) return
        window.location.href = `academic-reports/${studentId}`
    }

    return (
        <div className="lg:h-dvh h-auto overflow-auto scrollbar-hide">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">Student Academic Records</h1>
                    {/* <Button className="bg-brand cursor-pointer text-white" onPress={() => handleOpenModal("add")}> */}
                    {/*     <PlusCircle /> */}
                    {/*     Add Subject */}
                    {/* </Button> */}
                </div>

                {/* <SubjecStatistics data={subjectStats} /> */}

                <div className="mt-8">
                    <p className="mt-2 text-muted-foreground">Enrolled Students ({allStudents.length})</p>
                    <div className="text-primary text-md mx-4">
                        <p>Use the search bar to filter students</p>
                    </div>
                </div>

                <ul className="mt-6 divide-y divide-border">
                    {!isStudentsReady ?
                        <div className="flex flex-row ">
                            <Spinner size="sm" className="text-center" />
                            <p className="mx-4">Fetching class subject groups...</p>
                        </div>
                        :
                        allStudents.length < 1 ? <p>No available students</p> :
                            allStudents.slice(0, 100).map((item, index) => (
                                <li key={index} className="flex items-center gap-4 py-4">
                                    <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                        {item.surname.at(0)?.toUpperCase()}{item.otherNames.at(0)?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate font-medium text-foreground">{item.surname} {item.otherNames}</p>
                                            {/* <span className="text-xs text-muted-foreground">{t.studentCount}</span> */}
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">Total: {item.currentClass?.name}</p>
                                    </div>
                                    <div className="flex flex-row justify-center items-center">
                                        <Button isIconOnly={true} size="md" className="color-brand-100" color="primary" onPress={() => handleNavigateToRecordsPage(item.id)}>
                                            <EyeIcon />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                </ul>
            </section>
        </div >
    )
}
