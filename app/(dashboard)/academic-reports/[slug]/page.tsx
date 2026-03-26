"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AuthContext } from "@/context/authContext"
import { ClassRoomSchemaT, StaffT, StudentConductSchemaT, StudentSchemaT } from "@/lib/schemas"
import { BaseRequestHeaders, capitalize, ClassGroupListNumber, ClassGroupListOptions, ClassGroups, getSubjectGroupScoreOptions, Positions } from "@/lib/utils"
import { DownloadIcon, Edit, PlusCircle } from "lucide-react"
import { useContext, useState, useEffect, use } from "react"
import { Alert, Input, Select, SelectItem, Button, Spinner, Tabs, Tab, NumberInput, Divider } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Separator } from "@/components/ui/separator"
import { BaseErrMsg } from "@/lib/utils";
import { Card, CardBody } from "@heroui/react";
import { toast } from "react-toastify";
import { dynamicFormUpdates } from "@/lib/utils";
import { useSchoolContext } from "@/context/schoolContext"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { AcademicReportOption } from "@/components/dashboard/reports/AcademicReportOption"
import { RecordOptionSchema, RecordOptionPackage, RecordNumberSchema, RecordNumberPackage } from "@/components/dashboard/reports/reportSchema"
import { AcademicReportNumber } from "@/components/dashboard/reports/AcademicRecordNumber"

type classListProps = {
    scoreType: string,
    subjects: {
        id: string,
        subjectName: string,
    }[]
}

type recordFilterSchema = {
    academicTerm: string,
    className: string,
}

export default function AcademicReportPage({ params }: { params: Promise<{ slug: string }> }) {

    const { slug } = use(params)
    const schoolData = useSchoolContext()
    const userData = useContext(AuthContext)

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState<boolean>(false)
    const [modalAction, setModalAction] = useState<"view" | "update" | "delete" | "add">("view")

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

    const [studentConductInfo, setStudentConductInfo] = useState<StudentConductSchemaT>({
        rollNo: 0,
        attendance: 0,
        attitude: "",
        conduct: "",
        interest: "",
        teacherRemarks: ""
    })

    const [classSubjectList, setClassSubjectList] = useState<classListProps>({
        scoreType: "",
        subjects: []
    })
    const [allClassrooms, setAllClassrooms] = useState<ClassRoomSchemaT[]>([])

    // record crud actions
    const [studentScores, setStudentScores] = useState<dynamicFormUpdates[]>([])
    const [facilitators, setFacilitators] = useState<dynamicFormUpdates[]>([])
    const [positions, setPositions] = useState<dynamicFormUpdates[]>([])

    // const [availableClasses, setAvailableClasses] = useState<ClassRoomSchemaT[]>([])
    const [isClassSubjectListFetched, setIsClassSubjectListFetched] = useState<boolean>(false)

    // student records options 
    const [isStudentAcademicRecordsFetched, setIsStudentAcademicRecordsFetched] = useState<boolean>(false)
    const [allStudentAcademicRecords, setAllStudentAcademicRecord] = useState<(RecordOptionSchema | RecordNumberSchema)[]>([])
    const [academicRecordsFilterOptions, setAcademicRecordFilterOptions] = useState<recordFilterSchema>({ academicTerm: "1st", className: "Basic 1" })

    // export
    const [currentResultsToPrint, setCurrentResultToPrint] = useState<(RecordOptionSchema | RecordNumberSchema)[]>([])
    const [isCurrentResultToPrintReady, setIsCurrentResultToPrintReady] = useState<boolean>(false)
    const [finalRecordExportDataOptions, setFinalRecordExportDataOptions] = useState<RecordOptionPackage>({
        academicTerm: "",
        student: "",
        classGroup: "",
        className: "",
        type: "option",
        conduct: {
            rollNo: 0,
            attendance: 0,
            attitude: "",
            conduct: "",
            interest: "",
            promotedTo: "",
            teacherRemarks: ""
        },
        records: []
    })
    const [finalRecordExportDataNumber, setFinalRecordExportDataNumber] = useState<RecordNumberPackage>({
        academicTerm: "",
        student: "",
        classGroup: "",
        className: "",
        type: "number",
        conduct: {
            rollNo: 0,
            attendance: 0,
            attitude: "",
            conduct: "",
            interest: "",
            teacherRemarks: ""
        },
        records: []
    })
    const [showDownloadButton, setShowDownloadButton] = useState<boolean>(false)
    const [allStaff, setAllStaff] = useState<StaffT[]>([])

    const [reportGroupType, setReportGroupType] = useState<string>("")
    const [reportClassType, setReportClassType] = useState<string>("")

    useEffect(() => {
        const fetchAllStaff = async () => {
            try {
                const response = await fetch(`/api/teaching-staff?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                } else {
                    setAllStaff(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchAllStaff()
    }, [loading])

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const response = await fetch(`/api/students?query=${slug}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    setStudentInfo(result.data)
                    setReportClassType(result.data.currentClass.name)
                    setReportGroupType(result.data.currentClass.classGroup)
                }
            } catch (err: any) {
            }
        }
        fetchStudentInfo()
    }, [loading])

    useEffect(() => {
        const fetchAllClassrooms = async () => {
            try {
                const response = await fetch(`/api/classes?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    setAllClassrooms(result.data)
                }
            } catch (err: any) {
                throw new Error(err)
            }
        }
        fetchAllClassrooms()
    }, [loading])

    useEffect(() => {
        if (!reportGroupType) return
        const fetchStudentCurrentClassSubjects = async () => {
            try {
                const response = await fetch(`/api/api-utils?query=${reportGroupType}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    setIsClassSubjectListFetched(true)
                } else {
                    setClassSubjectList(result.data)
                    setIsClassSubjectListFetched(true)
                }
            } catch (err: any) {
            }
        }
        fetchStudentCurrentClassSubjects()
    }, [reportGroupType])

    useEffect(() => {
        if (!studentInfo.id) return
        const fetchAllStudentAcademicRecords = async () => {
            try {
                const response = await fetch(`/api/api-utils?query=records&student_id=${studentInfo.id}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    setIsStudentAcademicRecordsFetched(true)
                } else {
                    setAllStudentAcademicRecord(result.data)
                    setIsStudentAcademicRecordsFetched(true)
                }
            } catch (err: any) {
                setIsStudentAcademicRecordsFetched(true)
            }
        }
        fetchAllStudentAcademicRecords()
    }, [studentInfo.id])

    useEffect(() => {
        const fn = () => {
            const newdata = allStudentAcademicRecords.filter(obj => obj.academicTerm === academicRecordsFilterOptions.academicTerm && obj.className === academicRecordsFilterOptions.className)
            if (newdata.length < 1) {
                setCurrentResultToPrint([])
                setIsCurrentResultToPrintReady(false)
            }
            else {
                setCurrentResultToPrint(newdata)
                setIsCurrentResultToPrintReady(true)
            }
        }
        fn()
    }, [academicRecordsFilterOptions.academicTerm, academicRecordsFilterOptions.className])

    useEffect(() => {
        const fn = () => {
            if (isCurrentResultToPrintReady) {
                if (currentResultsToPrint.length < 1) {
                    setIsCurrentResultToPrintReady(false)
                    toast.info("Current filter has no records. Please re-filter.")
                    setShowDownloadButton(false)
                    return false
                }

                const single = currentResultsToPrint.at(0)
                if (!single) return false

                const academicTerm = single?.academicTerm
                const classGroup = single?.classGroup
                const classname = single?.className
                const student = single?.recordObj.student
                const conductObj = single?.conductObj
                const type = single.type


                if (academicTerm && classGroup && student && currentResultsToPrint.length > 0) {
                    if (type === "option") {
                        const out = (currentResultsToPrint as RecordOptionSchema[]).map(({ recordObj: { classSubject, scoreValue } }) => ({ classSubject, scoreValue }))
                        const data = { academicTerm: academicTerm, conduct: conductObj, student: student, classGroup: classGroup, type: type, className: classname, records: out }
                        setFinalRecordExportDataOptions(data)
                        setShowDownloadButton(true)
                        return true
                    } else {
                        const out = (currentResultsToPrint as RecordNumberSchema[]).map(({ recordObj: { classSubject, classScoreValue, examScoreValue, grade, totalScore, facilitator, position, id } }) => ({ classSubject, classScoreValue, examScoreValue, grade, totalScore, facilitator, position, id }))
                        const data = { academicTerm: academicTerm, conduct: conductObj, student: student, classGroup: classGroup, type: type, className: classname, records: out }
                        setFinalRecordExportDataNumber(data)
                        setShowDownloadButton(true)
                        return true
                    }
                }
                return false
            }
        }
        fn()
    }, [isCurrentResultToPrintReady])

    if (!userData || !schoolData) return <Spinner label="Loading please wait" />

    const handleOpenModal = (action: typeof modalAction, results?: (RecordOptionSchema | RecordNumberSchema)[]) => {
        if (!action) return
        setModalAction(action)
        onOpen()
    }

    const handleOnCloseModal = () => {
        setStudentInfo({
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
        setStudentConductInfo({
            rollNo: 0,
            attendance: 0,
            attitude: "",
            conduct: "",
            interest: "",
            teacherRemarks: ""
        })
        setStudentScores([])
        onClose()
    }

    const handleOnChangeScoreType = (subject: string, score: string) => {
        setStudentScores(prev => prev.find(obj => obj.field === subject) ? prev.map(obj => obj.field === subject ? { ...obj, value: score } : obj) : [...prev, { field: subject, value: score }])
    }

    const handleOnChangeFacilitatorValue = (subject: string, dataVal: string) => {
        setFacilitators(prev => prev.find(obj => obj.field === subject) ? prev.map(obj => obj.field === subject ? { ...obj, value: dataVal } : obj) : [...prev, { field: subject, value: dataVal }])
    }

    const handleOnChangePositionValue = (subject: string, posVal: string) => {
        setPositions(prev => prev.find(obj => obj.field === subject) ? prev.map(obj => obj.field === subject ? { ...obj, value: posVal } : obj) : [...prev, { field: subject, value: posVal }])
    }

    const handleSubmitStudentScores = async () => {
        if (!studentInfo.currentClass.classGroup) return
        const subjectLen = ClassGroupListNumber.includes(reportGroupType) ? studentScores.length / 2 : studentScores.length
        if (subjectLen !== classSubjectList.subjects.length) return toast.info("All score fields are required. Please check the `Scores` tab.")
        if (!studentConductInfo.rollNo || !studentConductInfo.attendance || !studentConductInfo.attitude || !studentConductInfo.interest || !studentConductInfo.conduct || !studentConductInfo.teacherRemarks) return toast.info("Please complete all fields in the `Conducts` Tab before saving.")

        const studentId = studentInfo.id
        const classname = reportClassType ?? studentInfo.currentClass.name
        const academicTerm = schoolData.schoolSettings.currentTerm
        const subjectScores = studentScores.map((item) => ({ subject: item.field, score_val: item.value }))
        let payload = {}
        const class_scores: { subject: string, score_val: string }[] = []
        const exam_scores: { subject: string, score_val: string }[] = []

        if (ClassGroupListNumber.includes(reportGroupType)) {
            studentScores.map((item) => item.field.startsWith("class") ? class_scores.push({ subject: item.field.split("__")[1], score_val: item.value }) : exam_scores.push({ subject: item.field.split("__")[1], score_val: item.value }))
            payload = { academicTerm, studentId, class_scores, classname, exam_scores, studentConductInfo, facilitators, positions }
        } else {
            payload = { academicTerm, studentId, subjectScores, classname, studentConductInfo }
            // return 
        }
        const submitApiUrl = ClassGroupListOptions.includes(reportGroupType) ? `/api/academic-record-item-option` : `/api/academic-record-item-number`
        const fn = async () => {
            try {
                const response = await fetch(submitApiUrl, {
                    method: "POST",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify(payload)
                })
                const result = await response.json()
                if (!response.ok) {
                    return Promise.reject(result.message)
                } else {
                    return Promise.resolve(result.message)
                }
            } catch (err: any) {
            }
        }

        handleOnCloseModal()
        setLoading(true)
        await toast.promise(
            fn,
            {
                pending: "Saving student record",
                success: "Student record successfully saved",
                error: BaseErrMsg,
            })
        setLoading(false)
    }

    const handleUpdateStudentScores = async () => {
        if (!studentInfo.currentClass.classGroup) return

        const studentId = studentInfo.id
        const classname = reportClassType.toLowerCase()
        const academicTerm = schoolData.schoolSettings.currentTerm
        const subjectScores = studentScores.map((item) => ({ subject: item.field, score_val: item.value }))
        let payload = {}
        const class_scores: { subject: string, score_val: string }[] = []
        const exam_scores: { subject: string, score_val: string }[] = []

        if (ClassGroupListNumber.includes(studentInfo.currentClass.classGroup)) {
            studentScores.map((item) => item.field.startsWith("class") ? class_scores.push({ subject: item.field.split("__")[1], score_val: item.value }) : exam_scores.push({ subject: item.field.split("__")[1], score_val: item.value }))
            payload = { academicTerm, studentId, class_scores, classname, exam_scores, studentConductInfo, facilitators, positions }
        } else {
            payload = { academicTerm, studentId, subjectScores, classname, studentConductInfo }
            // return
        }
        const submitApiUrl = ClassGroupListOptions.includes(studentInfo.currentClass.classGroup) ? `/api/academic-record-item-option` : `/api/academic-record-item-number`

        const fn = async () => {
            try {
                const response = await fetch(submitApiUrl, {
                    method: "PATCH",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify(payload)
                })
                const result = await response.json()
                if (!response.ok) {
                    return Promise.reject(result.message)
                } else {
                    return Promise.resolve(result.message)
                }
            } catch (err: any) {
            }
        }

        handleOnCloseModal()
        setLoading(true)
        await toast.promise(
            fn,
            {
                pending: "Updating student record",
                success: "Student record successfully updated",
                error: BaseErrMsg,
            })
        setLoading(false)
        window.location.reload()
    }

    const handleOnChangeReportType = (val: string) => {
        if (!val) return
        const val_split = val.split("__")
        setReportGroupType(val_split[1])
        setReportClassType(val_split[0])
    }

    return (
        <div className="lg:h-dvh h-auto overflow-auto scrollbar-hide">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">Student Info</h1>
                    <Button className="bg-brand cursor-pointer text-white" onPress={() => handleOpenModal("add")}>
                        <PlusCircle />
                        New Record
                    </Button>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                        <div className="flex items-center gap-3">
                            <Avatar className="size-12">
                                <AvatarFallback className="text-lg">{studentInfo.surname.at(0)}{studentInfo.otherNames.at(0)}</AvatarFallback>
                            </Avatar>
                            {!studentInfo.surname || !studentInfo.otherNames ? <Spinner /> :
                                <div>
                                    <p className="font-medium text-foreground">{studentInfo.surname} {studentInfo.otherNames}</p>
                                    <p className="text-sm text-muted-foreground">Current Class: {studentInfo.currentClass.name} | {studentInfo.gender === "m" ? "Male" : "Female"}</p>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-full mb-4">
                                {showDownloadButton && currentResultsToPrint.length > 0 ?
                                    <Alert
                                        color="default"
                                        description="Click the download icon to print or export the currently filtered result"
                                        endContent={
                                            ClassGroupListOptions.includes(currentResultsToPrint.at(0)?.classGroup ?? "") ?
                                                <PDFDownloadLink
                                                    document={<AcademicReportOption vacationDate={new Date(schoolData.schoolSettings.termEnds).toDateString()} reopeningDate={new Date(schoolData.schoolSettings.nextReopeningDate).toDateString()} data={finalRecordExportDataOptions} />}
                                                    fileName={`${studentInfo.surname}_${studentInfo.otherNames}_${studentInfo.currentClass.name}_${new Date().getFullYear()}`}>
                                                    {({ blob, url, loading, error }) =>
                                                        loading ? <Spinner size="sm" /> :
                                                            <div className="flex flex-row justify-center items-center">
                                                                <Button isIconOnly color="primary">
                                                                    <DownloadIcon />
                                                                </Button>
                                                            </div>
                                                    }
                                                </PDFDownloadLink>
                                                :
                                                <PDFDownloadLink
                                                    document={<AcademicReportNumber vacationDate={new Date(schoolData.schoolSettings.termEnds).toDateString()} reopeningDate={new Date(schoolData.schoolSettings.nextReopeningDate).toDateString()} data={finalRecordExportDataNumber} />}
                                                    fileName={`${studentInfo.surname}_${studentInfo.otherNames}_${studentInfo.currentClass.name}_${new Date().getFullYear()}`}>
                                                    {({ blob, url, loading, error }) =>
                                                        loading ? <Spinner size="sm" /> :
                                                            <div className="flex flex-row justify-center items-center">
                                                                <Button isIconOnly color="primary">
                                                                    <DownloadIcon />
                                                                </Button>
                                                            </div>
                                                    }
                                                </PDFDownloadLink>
                                        }
                                        title="Download Result"
                                        variant="faded"
                                    />
                                    :
                                    <Alert title="A downlaod button will appear here to download results once you set a filter" color="primary" />
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="mt-2 text-muted-foreground mb-4">Past Academic Records ({allStudentAcademicRecords.length})</p>
                </div>

                <div className="p-4 bg-primary-100 rounded-lg">
                    <p className="mt-2 text-muted-foreground">Filter using the select options below</p>
                    <div className="grid grid-cols-2 flex flex-row gap-4">
                        <Select
                            label="Term"
                            className="flex"
                            labelPlacement="inside"
                            placeholder="Select term"
                            selectedKeys={new Set([academicRecordsFilterOptions.academicTerm])}
                            onChange={(e) => setAcademicRecordFilterOptions({ ...academicRecordsFilterOptions, academicTerm: e.target.value })}
                        >
                            {["1st", "2nd", "3rd"].map((item) => (
                                <SelectItem key={item}>{item}</SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Class"
                            labelPlacement="inside"
                            placeholder="Select class"
                            selectedKeys={new Set([academicRecordsFilterOptions.className])}
                            onChange={(e) => setAcademicRecordFilterOptions({ ...academicRecordsFilterOptions, className: e.target.value })}
                        >
                            {allClassrooms.map((item) => (
                                <SelectItem key={item.name}>{item.name}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>

                <ul className="mt-6 divide-y divide-border">
                    {!isStudentAcademicRecordsFetched ?
                        <div className="flex flex-row ">
                            <Spinner size="sm" className="text-center" />
                            <p className="mx-4">Fetching academic records...</p>
                        </div>
                        :
                        currentResultsToPrint.length < 1 ? <p className="mx-4">Use the filter button to select a record</p> :
                            currentResultsToPrint.map((item: RecordOptionSchema | RecordNumberSchema, index: number) => (
                                <li key={index} className="flex items-center gap-4 py-4">
                                    <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                        {item.recordObj.classSubject.at(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate font-medium text-foreground">{item.recordObj.classSubject}</p>
                                            {/* <span className="text-xs text-muted-foreground">{item.recordObj.scoreValue}</span> */}
                                        </div>
                                        {item.type === "option" ?
                                            <p className="truncate text-sm text-muted-foreground">Score: {capitalize(item.recordObj.scoreValue).replace("_", " ")}</p> :
                                            <p className="truncate text-sm text-muted-foreground">Class Score: {item.recordObj.classScoreValue} | ExamScore: {item.recordObj.examScoreValue}</p>
                                        }
                                    </div>
                                    <div className="flex flex-row justify-center items-center">
                                        <Button size="sm" isIconOnly={true} className="color-brand-100 max-w-sm" color="primary" onPress={() => handleOpenModal("update", currentResultsToPrint)}>
                                            <Edit />
                                        </Button>
                                    </div>
                                </li>
                            ))}
                </ul>
            </section >

            <Modal isOpen={isOpen} size="lg" backdrop="opaque" placement="center" onOpenChange={onOpenChange} className={`overflow-y-auto h-auto max-h-[90%] mx-4 scrollbar-hide`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col bg-primary text-white">
                                {modalAction === "add" ? "New Academic Record" : modalAction === "view" || modalAction === "update" ? "Staff Info" : "Delete Staff"}
                            </ModalHeader>

                            <ModalBody className="gap-y-4 space-y-2">
                                <Alert className="mt-2" color="default" variant="faded" title={`${studentInfo.surname} ${studentInfo.otherNames}`} description={`${studentInfo.currentClass.name} | ${studentInfo.gender === "m" ? "Male" : "Female"}`} />

                                {modalAction === "add" ?
                                    <>
                                        <div className="mx-4">
                                            <Select
                                                isRequired={true}
                                                defaultSelectedKeys={[`${studentInfo.currentClass.name}__${studentInfo.currentClass.classGroup}`]}
                                                label="Change report class type"
                                                labelPlacement="inside"
                                                // selectedKeys={new Set(positions.filter(obj => obj.field === item.id).map(({ value }) => value))}
                                                placeholder="Select report class type"
                                                onChange={(e) => handleOnChangeReportType(e.target.value)}
                                            >
                                                {allClassrooms.map((item) => (
                                                    <>
                                                        <SelectItem key={`${item.name}__${item.classGroup}`}>{item.name}</SelectItem>
                                                    </>
                                                ))}
                                            </Select>
                                        </div>


                                        {!classSubjectList ? <Spinner label="Loading subjects. Please wait..." /> :
                                            <Tabs size="lg" radius="md" color="primary" disabledKeys={["promotions"]}>
                                                <Tab key="scores" title="Scores">
                                                    <Card className="flex flex-col gap-y-4">
                                                        <CardBody>
                                                            {classSubjectList?.scoreType === "options" ?
                                                                <div className="grid grid-cols-2 gap-y-8 m-2">
                                                                    {classSubjectList?.subjects.map((item) => (
                                                                        <div key={item.id} className="mx-1 gap-8">
                                                                            <Select
                                                                                isRequired={true}
                                                                                name={item.id}
                                                                                color={studentScores.find(obj => obj.field === item.id) ? "success" : "default"}
                                                                                defaultSelectedKeys={["good"]}
                                                                                label={item.subjectName}
                                                                                labelPlacement="inside"
                                                                                selectedKeys={new Set(studentScores.filter(obj => obj.field === item.id).map(({ value }) => value))}
                                                                                placeholder="Select grade"
                                                                                onChange={(e) => handleOnChangeScoreType(item.id, e.target.value)}
                                                                            >
                                                                                {getSubjectGroupScoreOptions(studentInfo.currentClass.classGroup).map((scoreoption) => (
                                                                                    <SelectItem key={scoreoption.key}>{scoreoption.label}</SelectItem>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                :
                                                                <div className="">
                                                                    {classSubjectList?.subjects.map((item) => (
                                                                        <div key={`class_exam_score_${item.id}`} className="bg-gray-200 pt-4 rounded-lg">
                                                                            <p className="flex mx-4">{item.subjectName}</p>
                                                                            <div key={item.id} className="grid grid-cols-2 gap-y-8 m-2">
                                                                                <div key={`class__${item.id}`} className="mx-2 gap-8">
                                                                                    <NumberInput
                                                                                        isRequired
                                                                                        label="Class Score"
                                                                                        placeholder="0"
                                                                                        isWheelDisabled
                                                                                        color={studentScores.find(obj => obj.field === `class__${item.id}`) ? "success" : "default"}
                                                                                        minValue={0}
                                                                                        maxValue={50}
                                                                                        value={Number(studentScores.find(obj => obj.field === `class__${item.id}`)?.value)}
                                                                                        labelPlacement="inside"
                                                                                        validate={(value) => {
                                                                                            if (value < 0) {
                                                                                                return "Minimum value is 50";
                                                                                            }
                                                                                            if (value > 50) {
                                                                                                return "Maximum value is 50";
                                                                                            }
                                                                                        }}
                                                                                        className="w-full"
                                                                                        onValueChange={(e) => handleOnChangeScoreType(`class__${item.id}`, e.toString())}
                                                                                    />
                                                                                </div>
                                                                                <div key={`exam__${item.id}`} className="mx-2 gap-8 mb-4">
                                                                                    <NumberInput
                                                                                        isRequired
                                                                                        label="Exam Score"
                                                                                        placeholder="0"
                                                                                        isWheelDisabled
                                                                                        minValue={0}
                                                                                        maxValue={50}
                                                                                        value={Number(studentScores.find(obj => obj.field === `exam__${item.id}`)?.value)}
                                                                                        color={studentScores.find(obj => obj.field === `exam__${item.id}`) ? "success" : "default"}
                                                                                        labelPlacement="inside"
                                                                                        validate={(value) => {
                                                                                            if (value < 0) {
                                                                                                return "Minimum value is 0";
                                                                                            }
                                                                                            if (value > 50) {
                                                                                                return "Number must be less than 50";
                                                                                            }
                                                                                        }}
                                                                                        className="w-full"
                                                                                        onValueChange={(e) => handleOnChangeScoreType(`exam__${item.id}`, e.toString())}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {reportGroupType === "jhs" ?
                                                                                <div key={`facil_pos_${item.id}`} className="grid grid-cols-3 gap-y-8 m-4 gap-x-4 mx-4">
                                                                                    <div key={`facil_${item.id}`} className="flex flex-row gap-4 col-span-2">
                                                                                        <Select
                                                                                            isRequired={true}
                                                                                            color={facilitators.find(obj => obj.field === item.id) ? "success" : "default"}
                                                                                            label="Facilitator"
                                                                                            labelPlacement="inside"
                                                                                            selectedKeys={new Set([facilitators.find(obj => obj.field === item.id)?.value ?? ""])}
                                                                                            placeholder="Select facilitator"
                                                                                            onChange={(e) => handleOnChangeFacilitatorValue(item.id, e.target.value)}
                                                                                        >
                                                                                            {allStaff.map((item: StaffT) => (
                                                                                                <SelectItem key={`${item.personalInfo.first_name} ${item.personalInfo.last_name}`} textValue={`${item.personalInfo.last_name} ${item.personalInfo.first_name}`}>{item.personalInfo.last_name} {item.personalInfo.first_name}</SelectItem>
                                                                                            ))}
                                                                                        </Select>
                                                                                    </div>
                                                                                    <div key={`pos_${item.id}`} className="mb-4">
                                                                                        <Select
                                                                                            isRequired={true}
                                                                                            color={positions.find(obj => obj.field === item.id) ? "success" : "default"}
                                                                                            defaultSelectedKeys={["good"]}
                                                                                            label="Position"
                                                                                            labelPlacement="inside"
                                                                                            selectedKeys={new Set(positions.filter(obj => obj.field === item.id).map(({ value }) => value))}
                                                                                            placeholder="Select position"
                                                                                            onChange={(e) => handleOnChangePositionValue(item.id, e.target.value)}
                                                                                        >
                                                                                            {Positions.map((item) => (
                                                                                                <SelectItem key={item.label}>{item.label}</SelectItem>
                                                                                            ))}
                                                                                        </Select>
                                                                                    </div>
                                                                                </div>
                                                                                : null}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }
                                                        </CardBody>
                                                    </Card>
                                                </Tab>
                                                <Tab key="conduct" title="Conduct">
                                                    <Card className="flex flex-col gap-y-4">
                                                        <div className="gap-y-8 m-4">
                                                            <div className="grid grid-cols-2 mx-4 gap-8 space-y-12">
                                                                <NumberInput
                                                                    isRequired
                                                                    label="Number on roll"
                                                                    placeholder="5"
                                                                    value={studentConductInfo.rollNo}
                                                                    labelPlacement="inside"
                                                                    validate={(value) => {
                                                                        if (value < 0) {
                                                                            return "Number must be greater than 0";
                                                                        }
                                                                        if (value > 100) {
                                                                            return "Number must be less than 54";
                                                                        }
                                                                    }}
                                                                    className="w-full"
                                                                    onValueChange={(e) => setStudentConductInfo({ ...studentConductInfo, rollNo: e })}
                                                                />
                                                                <NumberInput
                                                                    isRequired
                                                                    label="Attendance"
                                                                    placeholder="5"
                                                                    labelPlacement="inside"
                                                                    value={studentConductInfo.attendance}
                                                                    validate={(value) => {
                                                                        if (value < 0) {
                                                                            return "Number must be greater than 0";
                                                                        }
                                                                        if (value > 100) {
                                                                            return "Number must be less than 54";
                                                                        }
                                                                    }}
                                                                    className="w-full"
                                                                    onValueChange={(e) => setStudentConductInfo({ ...studentConductInfo, attendance: e })}
                                                                />
                                                            </div>
                                                            <div className="mx-4 space-y-8 gap-y-4">
                                                                <Input
                                                                    label="Attitude"
                                                                    labelPlacement="inside"
                                                                    placeholder="Enter student attitude"
                                                                    className="w-full"
                                                                    value={studentConductInfo.attitude}
                                                                    onChange={(e) => setStudentConductInfo({ ...studentConductInfo, attitude: e.target.value })}
                                                                />
                                                                <Input
                                                                    label="Conduct"
                                                                    labelPlacement="inside"
                                                                    placeholder="Enter student conduct"
                                                                    className="w-full"
                                                                    value={studentConductInfo.conduct}
                                                                    onChange={(e) => setStudentConductInfo({ ...studentConductInfo, conduct: e.target.value })}
                                                                />
                                                                <Input
                                                                    label="Interest"
                                                                    labelPlacement="inside"
                                                                    placeholder="Enter student interest"
                                                                    className="w-full"
                                                                    value={studentConductInfo.interest}
                                                                    onChange={(e) => setStudentConductInfo({ ...studentConductInfo, interest: e.target.value })}
                                                                />
                                                                <Input
                                                                    label="Teacher remarks"
                                                                    labelPlacement="inside"
                                                                    placeholder="Enter your remarks"
                                                                    className="w-full"
                                                                    value={studentConductInfo.teacherRemarks}
                                                                    onChange={(e) => setStudentConductInfo({ ...studentConductInfo, teacherRemarks: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Tab>
                                                <Tab key="promotions" title="Promotions">
                                                    <Card className="flex flex-col gap-y-4">
                                                        <div className="grid grid-cols-2 gap-y-8 m-4">
                                                            <div className="mx-4 gap-8 space-y-12">
                                                                <NumberInput
                                                                    isRequired
                                                                    name="rollNo"
                                                                    label="Number on roll"
                                                                    labelPlacement="outside"
                                                                    validate={(value) => {
                                                                        if (value < 0) {
                                                                            return "Number must be greater than 0";
                                                                        }
                                                                        if (value > 54) {
                                                                            return "Number must be less than 54";
                                                                        }
                                                                    }}
                                                                    className="w-full"
                                                                    formatOptions={{
                                                                        style: "percent",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Tab>

                                            </Tabs>
                                        }
                                        <Separator />
                                    </>
                                    :
                                    modalAction === "update" ?
                                        !classSubjectList ? <Spinner label="Loading subjects. Please wait..." /> :
                                            <Tabs size="lg" radius="md" color="primary" disabledKeys={["promotions"]}>
                                                <Tab key="scores" title="Scores">
                                                    <Card className="flex flex-col gap-y-4">
                                                        <CardBody>
                                                            {(currentResultsToPrint as RecordOptionSchema[]).at(0)?.type === "option" ?
                                                                <div className="grid grid-cols-2 gap-y-8 m-2">
                                                                    {(currentResultsToPrint as RecordOptionSchema[])?.map((item) => (
                                                                        <div key={item.recordObj.id} className="mx-1 gap-8">
                                                                            <Select
                                                                                isRequired={true}
                                                                                name={item.recordObj.id}
                                                                                color={studentScores.find(obj => obj.field === item.recordObj.id) ? "success" : "default"}
                                                                                defaultSelectedKeys={[item.recordObj.scoreValue.toLowerCase().replace(" ", "_")]}
                                                                                label={item.recordObj.classSubject}
                                                                                labelPlacement="inside"
                                                                                // selectedKeys={new Set(studentScores.filter(obj => obj.field === item.recordObj.id).map(({ value }) => value))}
                                                                                placeholder="Select grade"
                                                                                onChange={(e) => handleOnChangeScoreType(item.recordObj.id, e.target.value)}
                                                                            >
                                                                                {getSubjectGroupScoreOptions(studentInfo.currentClass.classGroup).map((scoreoption) => (
                                                                                    <SelectItem key={scoreoption.key}>{scoreoption.label}</SelectItem>
                                                                                ))}
                                                                            </Select>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                :
                                                                <div className="">
                                                                    {(currentResultsToPrint as RecordNumberSchema[]).map((item) => (
                                                                        <div key={`class_exam_score_${item.recordObj.id}`} className="bg-gray-200 pt-4 rounded-lg">
                                                                            <p className="flex mx-4">{item.recordObj.classSubject}</p>
                                                                            <div key={item.recordObj.id} className="grid grid-cols-2 gap-y-8 m-2">
                                                                                <div key={`class__${item.recordObj.id}`} className="mx-2 gap-8">
                                                                                    <NumberInput
                                                                                        isRequired
                                                                                        label="Class Score"
                                                                                        placeholder="0"
                                                                                        isWheelDisabled
                                                                                        color={studentScores.find(obj => obj.field === `class__${item.recordObj.id}`) ? "success" : "default"}
                                                                                        minValue={0}
                                                                                        maxValue={50}
                                                                                        defaultValue={item.recordObj.classScoreValue}
                                                                                        labelPlacement="inside"
                                                                                        validate={(value) => {
                                                                                            if (value < 0) {
                                                                                                return "Minimum value is 50";
                                                                                            }
                                                                                            if (value > 50) {
                                                                                                return "Maximum value is 50";
                                                                                            }
                                                                                        }}
                                                                                        className="w-full"
                                                                                        onValueChange={(e) => handleOnChangeScoreType(`class__${item.recordObj.id}`, e.toString())}
                                                                                    />
                                                                                </div>
                                                                                <div key={`exam__${item.recordObj.id}`} className="mx-2 gap-8">
                                                                                    <NumberInput
                                                                                        isRequired
                                                                                        label="Exam Score"
                                                                                        placeholder="0"
                                                                                        isWheelDisabled
                                                                                        minValue={0}
                                                                                        maxValue={50}
                                                                                        defaultValue={item.recordObj.examScoreValue}
                                                                                        color={studentScores.find(obj => obj.field === `exam__${item.recordObj.id}`) ? "success" : "default"}
                                                                                        labelPlacement="inside"
                                                                                        validate={(value) => {
                                                                                            if (value < 0) {
                                                                                                return "Minimum value is 0";
                                                                                            }
                                                                                            if (value > 50) {
                                                                                                return "Number must be less than 50";
                                                                                            }
                                                                                        }}
                                                                                        className="w-full"
                                                                                        onValueChange={(e) => handleOnChangeScoreType(`exam__${item.recordObj.id}`, e.toString())}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                            {item.classGroup === "jhs" ?
                                                                                <div key={`facil_pos_${item.recordObj.id}`} className="grid grid-cols-3 gap-y-8 m-4 gap-x-4 mx-4">
                                                                                    <div key={`facil_${item.recordObj.id}`} className="flex flex-row gap-4 col-span-2">
                                                                                        <Select
                                                                                            isRequired={true}
                                                                                            color={facilitators.find(obj => obj.field === item.recordObj.id) ? "success" : "default"}
                                                                                            label="Facilitator"
                                                                                            labelPlacement="inside"
                                                                                            defaultSelectedKeys={[item.recordObj.facilitator ?? ""]}
                                                                                            // selectedKeys={new Set([item.recordObj.facilitator ?? ""])}
                                                                                            placeholder="Select facilitator"
                                                                                            onChange={(e) => handleOnChangeFacilitatorValue(item.recordObj.id, e.target.value)}
                                                                                        >
                                                                                            {allStaff.map((item: StaffT) => (
                                                                                                <SelectItem key={`${item.personalInfo.first_name} ${item.personalInfo.last_name}`} textValue={`${item.personalInfo.last_name} ${item.personalInfo.first_name}`}>{item.personalInfo.last_name} {item.personalInfo.first_name}</SelectItem>
                                                                                            ))}
                                                                                        </Select>
                                                                                    </div>
                                                                                    <div key={`pos_${item.recordObj.id}`}>
                                                                                        <Select
                                                                                            isRequired={true}
                                                                                            color={positions.find(obj => obj.field === item.recordObj.id) ? "success" : "default"}
                                                                                            label="Position"
                                                                                            defaultSelectedKeys={[item.recordObj.position ?? ""]}
                                                                                            labelPlacement="inside"
                                                                                            // selectedKeys={item.recordObj.position}
                                                                                            placeholder="Select position"
                                                                                            onChange={(e) => handleOnChangePositionValue(item.recordObj.id, e.target.value)}
                                                                                        >
                                                                                            {Positions.map((item) => (
                                                                                                <SelectItem key={item.label}>{item.label}</SelectItem>
                                                                                            ))}
                                                                                        </Select>
                                                                                    </div>
                                                                                    <Divider />
                                                                                </div>
                                                                                : null}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            }
                                                        </CardBody>
                                                    </Card>
                                                </Tab>
                                                <Tab key="conduct" title="Conduct">
                                                    <Card className="flex flex-col gap-y-4">
                                                        <div className="gap-y-8 m-4">
                                                            <div className="grid grid-cols-2 mx-4 gap-8 space-y-12">
                                                                <NumberInput
                                                                    isRequired
                                                                    label="Number on roll"
                                                                    placeholder="5"
                                                                    labelPlacement="inside"
                                                                    validate={(value) => {
                                                                        if (value < 0) {
                                                                            return "Number must be greater than 0";
                                                                        }
                                                                        if (value > 54) {
                                                                            return "Number must be less than 54";
                                                                        }
                                                                    }}
                                                                    defaultValue={currentResultsToPrint.at(0)?.conductObj?.rollNo}
                                                                    className="w-full"
                                                                    onValueChange={(e) => setStudentConductInfo({ ...studentConductInfo, rollNo: e })}
                                                                />
                                                                <NumberInput
                                                                    isRequired
                                                                    label="Attendance"
                                                                    placeholder="5"
                                                                    labelPlacement="inside"
                                                                    defaultValue={currentResultsToPrint.at(0)?.conductObj?.attendance}
                                                                    validate={(value) => {
                                                                        if (value < 0) {
                                                                            return "Number must be greater than 0";
                                                                        }
                                                                        if (value > 54) {
                                                                            return "Number must be less than 54";
                                                                        }
                                                                    }}
                                                                    className="w-full"
                                                                    onValueChange={(e) => setStudentConductInfo({ ...studentConductInfo, attendance: e })}
                                                                />
                                                            </div>
                                                            <div className="mx-4 space-y-8 gap-y-4">
                                                                <Input
                                                                    label="Attitude"
                                                                    labelPlacement="inside"
                                                                    placeholder="Enter student attitude"
                                                                    defaultValue={currentResultsToPrint.at(0)?.conductObj?.attitude}
                                                                    className="w-full"
                                                                    onChange={(e) => setStudentConductInfo({ ...studentConductInfo, attitude: e.target.value })}
                                                                />
                                                                <Input
                                                                    label="Conduct"
                                                                    labelPlacement="inside"
                                                                    placeholder="Enter student conduct"
                                                                    defaultValue={currentResultsToPrint.at(0)?.conductObj?.conduct}
                                                                    className="w-full"
                                                                    onChange={(e) => setStudentConductInfo({ ...studentConductInfo, conduct: e.target.value })}
                                                                />
                                                                <Input
                                                                    label="Interest"
                                                                    labelPlacement="inside"
                                                                    defaultValue={currentResultsToPrint.at(0)?.conductObj?.interest}
                                                                    placeholder="Enter student interest"
                                                                    className="w-full"
                                                                    onChange={(e) => setStudentConductInfo({ ...studentConductInfo, interest: e.target.value })}
                                                                />
                                                                <Input
                                                                    label="Teacher remarks"
                                                                    labelPlacement="inside"
                                                                    placeholder="Enter your remarks"
                                                                    defaultValue={currentResultsToPrint.at(0)?.conductObj?.teacherRemarks}
                                                                    className="w-full"
                                                                    onChange={(e) => setStudentConductInfo({ ...studentConductInfo, teacherRemarks: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Tab>
                                                <Tab key="promotions" title="Promotions">
                                                    <Card className="flex flex-col gap-y-4">
                                                        <div className="grid grid-cols-2 gap-y-8 m-4">
                                                            <div className="mx-4 gap-8 space-y-12">
                                                                <NumberInput
                                                                    isRequired
                                                                    name="rollNo"
                                                                    label="Number on roll"
                                                                    labelPlacement="outside"
                                                                    validate={(value) => {
                                                                        if (value < 0) {
                                                                            return "Number must be greater than 0";
                                                                        }
                                                                        if (value > 54) {
                                                                            return "Number must be less than 54";
                                                                        }
                                                                    }}
                                                                    className="w-full"
                                                                    formatOptions={{
                                                                        style: "percent",
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card>
                                                </Tab>

                                            </Tabs>
                                        : modalAction === "delete" ?
                                            <Card className="w-full">
                                                <p>Proceed to delete</p>
                                            </Card>
                                            :
                                            null
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="flat" onPress={() => handleOnCloseModal()}>
                                    Close
                                </Button>
                                {modalAction === "add" ?
                                    <Button type="submit" color="primary" onPress={handleSubmitStudentScores}>
                                        Submit
                                    </Button>
                                    : modalAction === "update" ?
                                        <Button type="submit" color="primary" onPress={handleUpdateStudentScores}>
                                            Save Changes
                                        </Button>
                                        : null
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </div >
    )
}
