"use client"
// import type { DateValue } from "@react-types/calendar";
import { DateValue } from "@heroui/react";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date"
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { PlusCircle, EyeIcon, Edit, TrashIcon, UserRound } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ClassRoomSchemaT, GuardianSchemaT, StudentSchemaT, StudentStatsSchemaT } from "@/lib/schemas"
import { Input, Select, SelectItem, Button, DatePicker, Pagination } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Separator } from "@/components/ui/separator"
import { BaseErrMsg, BaseRequestHeaders, capitalize, dynamicFormUpdates, EducationalBackgrounds, Nationalities } from "@/lib/utils"
import StudentStatistics from "@/components/dashboard/student-stats"
import { toast } from "react-toastify"
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function Students() {

    const router = useRouter()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const [modalAction, setModalAction] = useState<"view" | "add" | "delete" | "update">("view")
    const [loading, setLoading] = useState<boolean>(false)
    const [getGuardianInfo, setGetGuardianInfo] = useState<boolean>(false)
    const [studentFetched, setStudentFetched] = useState<boolean>(false)
    const [allStudents, setAllStudents] = useState<StudentSchemaT[]>([])
    const [guardianInfo, setGuardianInfo] = useState<GuardianSchemaT>({
        fullname: "",
        occupation: "",
        educationalBackground: "",
        phone: "",
        postalAddress: "",
        houseNumber: "",
    })
    const [studentStats, setStudentStats] = useState<StudentStatsSchemaT>({
        maleCount: 0,
        femaleCount: 0,
        malePercentage: 0,
        femalePercentage: 0
    })
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
    const [newStudentClass, setNewStudentClass] = useState<string>("")
    const [availabelClasses, setAvailableClasses] = useState<ClassRoomSchemaT[]>([])

    const studentUpdates = useRef<dynamicFormUpdates[]>([])
    const guardianUpdates = useRef<dynamicFormUpdates[]>([])

    const maxDisplay = 10
    const [currentPage, setCurrentPage] = useState<number>(1)

    useEffect(() => {
        const fetchStudentStats = async () => {
            try {
                const response = await fetch(`/api/stats?query=students`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    setStudentStats(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchStudentStats()
    }, [loading])

    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const response = await fetch(`/api/students?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    setStudentFetched(false)
                    return Promise.reject(response.status)
                } else {
                    setStudentFetched(true)
                    setAllStudents(result.data)
                }
            } catch (err: any) {
                setStudentFetched(false)
            }
        }
        fetchAllStudents()
    }, [loading, currentPage])

    useEffect(() => {
        const fetchAvailableClasses = async () => {
            try {
                const response = await fetch("api/classes?query=all", {
                    headers: { ...BaseRequestHeaders }
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    setAvailableClasses(result.data)
                }
            } catch (err: any) {
                setAvailableClasses([])
            }
        }
        { modalAction === "add" || modalAction === "update" ? fetchAvailableClasses() : null }
    }, [modalAction])


    useEffect(() => {
        const fetchGuardianInfo = async () => {
            if (!studentInfo.guardianId) return
            try {
                const response = await fetch(`api/guardian?query=${studentInfo.guardianId}`, {
                    headers: { ...BaseRequestHeaders }
                })
                const result = await response.json()
                if (!response.ok) {
                    setGetGuardianInfo(false)
                } else {
                    setGuardianInfo(result.data)
                }
            } catch (err: any) {
                setGetGuardianInfo(false)
            }
        }
        { getGuardianInfo ? fetchGuardianInfo() : null }
    }, [getGuardianInfo])

    const handleStudentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (modalAction === "update") {
            const updates = studentUpdates.current
            const fieldExists = updates.find(obj => obj.field === e.target.name)
            if (fieldExists) {
                fieldExists.value = e.target.value
            } else {
                studentUpdates.current.push({ field: e.target.name, value: e.target.value })
            }
        }
        if (e.target.name === "currentClass") {
            setStudentInfo({ ...studentInfo, currentClass: { id: e.target.value, name: e.target.value } })
        } else {
            setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value })
        }
    }

    const handleGuardianInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (modalAction === "update") {
            const updates = guardianUpdates.current
            const fieldExists = updates.find(obj => obj.field === e.target.name)
            if (fieldExists) {
                fieldExists.value = e.target.value
            } else {
                guardianUpdates.current.push({ field: e.target.name, value: e.target.value })
            }
        }
        setGuardianInfo({ ...guardianInfo, [e.target.name]: e.target.value })
    }

    const handleOpenModal = (action: typeof modalAction, item?: StudentSchemaT) => {
        if (!action) return
        setModalAction(action)
        { item ? setStudentInfo(item) : null }
        if (action === "view" || action === "update" || action === "delete") {
            setGetGuardianInfo(true)
        } else {
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
            setGuardianInfo({
                fullname: "",
                occupation: "",
                educationalBackground: "",
                phone: "",
                postalAddress: "",
                houseNumber: "",
            })
        }
        onOpen()
    }

    function handleOnCloseModal() {
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
        setGuardianInfo({
            fullname: "",
            occupation: "",
            educationalBackground: "",
            phone: "",
            postalAddress: "",
            houseNumber: "",
        })
        onClose()
        setGetGuardianInfo(false)
    }

    const handleCreateNewStudent = async () => {
        const { currentClass, ...studentInfoPayload } = studentInfo
        const formattedDate = new Date(studentInfoPayload.dateOfBirth).toISOString().split("T")[0]
        const newStudentInfoPayload = { ...studentInfoPayload, dateOfBirth: formattedDate }

        onClose()
        const fn = async () => {
            try {
                const response = await fetch("/api/students", {
                    method: "POST",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify({ studentInfo: newStudentInfoPayload, newStudentClass: studentInfo.currentClass.id, guardianInfo })
                })
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    return Promise.resolve(response.status)
                }

            } catch (err: any) {
                throw Error(err)
            }
        }

        setLoading(true)
        await toast.promise(
            fn,
            {
                pending: "Creating student...",
                success: "Student successfully created",
                error: BaseErrMsg
            }
        )
        handleOnCloseModal()
        setLoading(false)
    }

    async function handleDeleteStudent() {
        onClose()
        const fn = async () => {
            try {
                const response = await fetch(`/api/students?query=${studentInfo.id}`, {
                    method: "DELETE",
                    headers: { ...BaseRequestHeaders },
                })
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    return Promise.resolve(response.status)
                }

            } catch (err: any) {
                throw Error(err)
            }
        }

        setLoading(true)
        await toast.promise(
            fn,
            {
                pending: "Deleting student...",
                success: "Student successfully deleted",
                error: BaseErrMsg
            }
        )
        setLoading(false)
    }

    const handleUpdateStudentInfo = async () => {
        let studentFieldUpdates = {}
        let guardianFieldUpdates = {}
        for (var [_, v] of Object.entries(studentUpdates.current)) {
            if (v.field !== "currentClass") {
                studentFieldUpdates = { ...studentFieldUpdates, [v.field]: v.value }
            }
        }
        for (var [_, v] of Object.entries(guardianUpdates.current)) {
            guardianFieldUpdates = { ...guardianFieldUpdates, [v.field]: v.value }
        }

        onClose()
        const fn = async () => {
            try {
                const response = await fetch(`api/students?query=${studentInfo.id}`, {
                    method: "PATCH",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify({ guardianId: guardianInfo.id, newStudentClass: studentInfo.currentClass.id, studentFieldUpdates, guardianFieldUpdates })
                })
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    return Promise.resolve(response.status)
                }
            } catch (err: any) {
                setLoading(false)
            }
        }

        setLoading(true)
        await toast.promise(
            fn,
            {
                pending: "Updating student info...",
                success: "Student info successfully updated",
                error: BaseErrMsg
            }
        )
        handleOnCloseModal()
        setLoading(false)
    }

    return (
        <div className="lg:h-dvh h-auto overflow-auto mb-4 scrollbar-hide">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">Students ({allStudents.length})</h1>
                    <Button className="bg-brand cursor-pointer text-white" onPress={() => handleOpenModal("add")}>
                        <PlusCircle />
                        New Student
                    </Button>
                </div>

                <StudentStatistics data={studentStats} />

                <div className="mt-8">
                    <p className="mt-2 text-muted-foreground">All Students({allStudents.length})</p>
                </div>

                <ul className="mt-6 divide-y divide-border">
                    {!studentFetched ?
                        <div className="flex flex-row ">
                            <Spinner size="sm" className="text-center" />
                            <p className="mx-4">Fetching students data...</p>
                        </div>
                        : allStudents.length < 1 ? <p className="mx-4">No students available</p> :
                            allStudents.slice(currentPage, currentPage + maxDisplay).map((item, index) => (
                                <li key={index} className="flex items-center gap-4 py-4">
                                    <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                        {item.surname[0]}{item.otherNames[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate font-medium text-foreground">{item.surname} {item.otherNames}</p>
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">Class: {item.currentClass?.name}</p>
                                    </div>
                                    <div className="flex flex-row justify-center items-center">
                                        <Button isIconOnly={true} size="sm" className="color-brand-100" color="primary" onPress={() => handleOpenModal("update", item)}>
                                            <Edit />
                                        </Button>
                                        <Button isIconOnly={true} size="sm" className="color-brand-100 mx-2" color="primary" onPress={() => handleOpenModal("delete", item)}>
                                            <TrashIcon />
                                        </Button>
                                        <Button isIconOnly={true} size="sm" className="color-brand-100" color="primary" onPress={() => handleOpenModal("view", item)}>
                                            <EyeIcon />
                                        </Button>

                                    </div>
                                </li>
                            ))}
                    <div className="mt-4">
                        <Pagination color="primary" page={currentPage} total={Math.ceil(allStudents.length/maxDisplay)} onChange={(e) => setCurrentPage(prev => prev < e ? prev + maxDisplay : prev - maxDisplay)} />
                    </div>
                </ul>
            </section>

            <Modal isOpen={isOpen} size="lg" backdrop="opaque" placement="center" onOpenChange={onOpenChange} className={`overflow-y-auto h-auto max-h-[50rem] mx-4`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col bg-primary text-white mb-4">
                                {modalAction === "add" ?
                                    "Add New Student" : modalAction === "view" ? "Student Info" : "Edit Student Info"}
                            </ModalHeader>

                            <ModalBody className="">
                                {modalAction === "add" || modalAction === "update" ?
                                    <>
                                        <p className="font-semibold">Personal Info</p>
                                        <div className="mx-4 gap-8 space-y-12 mb-4">
                                            <Input
                                                isRequired
                                                name="surname"
                                                label="Surname"
                                                labelPlacement="outside"
                                                placeholder="John"
                                                className="w-full"
                                                value={studentInfo.surname}
                                                onChange={handleStudentInfoChange}
                                            />
                                            <Input
                                                isRequired
                                                name="otherNames"
                                                label="Other names"
                                                labelPlacement="outside"
                                                placeholder="Doe"
                                                className="w-full"
                                                value={studentInfo.otherNames}
                                                onChange={handleStudentInfoChange}
                                            />
                                            <Input
                                                name="placeOfBirth"
                                                label="Place of Birth"
                                                labelPlacement="outside"
                                                placeholder="Kumasi"
                                                className="w-full"
                                                value={studentInfo.placeOfBirth}
                                                onChange={handleStudentInfoChange}
                                            />
                                            <DatePicker
                                                name="dateOfBirth"
                                                label="Date of Birth"
                                                labelPlacement="outside"
                                                showMonthAndYearPickers
                                                className=""
                                                value={
                                                    studentInfo.dateOfBirth
                                                        ? new CalendarDate(
                                                            new Date(studentInfo.dateOfBirth).getFullYear(),
                                                            new Date(studentInfo.dateOfBirth).getMonth() + 1,
                                                            new Date(studentInfo.dateOfBirth).getDate()
                                                        ) as unknown as DateValue
                                                        : new CalendarDate(2005, 5, 15) as unknown as DateValue
                                                }
                                                placeholderValue={new CalendarDate(2005, 5, 15) as unknown as DateValue}
                                                onChange={(value) => setStudentInfo({
                                                    ...studentInfo,
                                                    dateOfBirth: value ? value.toDate(getLocalTimeZone()) : new Date()
                                                })}
                                            />
                                            <Select
                                                name="nationality"
                                                isRequired
                                                label="Nationality"
                                                labelPlacement="outside"
                                                placeholder="Select nationality"
                                                selectedKeys={new Set(["Ghanaian"])}
                                                value={studentInfo.nationality}
                                                defaultSelectedKeys={[studentInfo.nationality]}
                                                onChange={handleStudentInfoChange}
                                            >
                                                {Nationalities.map((item) => (
                                                    <SelectItem key={item}>{item}</SelectItem>
                                                ))}
                                            </Select>
                                            <Select
                                                name="gender"
                                                isRequired
                                                label="Gender"
                                                labelPlacement="outside"
                                                placeholder="Select gender"
                                                value={studentInfo.gender}
                                                onChange={handleStudentInfoChange}
                                            >
                                                <SelectItem key="Male">Male</SelectItem>
                                                <SelectItem key="Female">Female</SelectItem>
                                            </Select>
                                            <Select
                                                name="religion"
                                                label="Religion"
                                                labelPlacement="outside"
                                                placeholder="Select religion"
                                                defaultSelectedKeys={[studentInfo.religion]}
                                                value={studentInfo.religion}
                                                onChange={handleStudentInfoChange}
                                            >
                                                <SelectItem key="Christian">Christian</SelectItem>
                                                <SelectItem key="Muslim">Muslim</SelectItem>
                                                <SelectItem key="Other">Other</SelectItem>
                                            </Select>
                                            <Input
                                                name="schoolsAttended"
                                                label="Previous School"
                                                labelPlacement="outside"
                                                placeholder="Name of previous school if applicable"
                                                className="w-full"
                                                value={studentInfo.schoolsAttended ?? ""}
                                                onChange={handleStudentInfoChange}
                                            />
                                            <Input
                                                name="healthProblems"
                                                label="Health Issues"
                                                labelPlacement="outside"
                                                placeholder="Concerning health related issues"
                                                className="w-full"
                                                value={studentInfo.healthProblems ?? ""}
                                                onChange={handleStudentInfoChange}
                                            />
                                        </div>
                                        <Separator />
                                        <p className="font-semibold">Student Assigned Class</p>
                                        <div className="mx-4 gap-8 space-y-12">
                                            <Select
                                                name="currentClass"
                                                isRequired
                                                label="Student Class"
                                                labelPlacement="outside"
                                                placeholder="Select student class"
                                                selectedKeys={[studentInfo.currentClass?.id ?? ""]}
                                                value={studentInfo.currentClass.id}
                                                onChange={handleStudentInfoChange}
                                            >
                                                {availabelClasses.map((item) => (
                                                    <SelectItem key={item.id} textValue={`${item.name} ${item.subclassLabel ?? ""}`}>{item.name} {item.subclassLabel ?? ""}</SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <Separator />
                                        <p className="font-semibold">Guardian Info</p>
                                        <div className="mx-4 gap-8 space-y-12">
                                            <Input
                                                name="fullname"
                                                isRequired={true}
                                                label="Guardian Name"
                                                labelPlacement="outside"
                                                placeholder=""
                                                className="w-full"
                                                value={guardianInfo.fullname}
                                                onChange={handleGuardianInfoChange}
                                            />
                                            <Input
                                                name="occupation"
                                                label="Occupation"
                                                labelPlacement="outside"
                                                placeholder="Trader"
                                                className="w-full"
                                                value={guardianInfo.occupation}
                                                onChange={handleGuardianInfoChange}
                                            />
                                            <Select
                                                name="educationalBackground"
                                                label="Educational Background"
                                                labelPlacement="outside"
                                                placeholder={modalAction === "update" ? guardianInfo.educationalBackground : "Select edu. background"}
                                                value={guardianInfo.educationalBackground}
                                                onChange={handleGuardianInfoChange}
                                            >
                                                {EducationalBackgrounds.map((item) => (
                                                    <SelectItem key={item} textValue={`${item}`}>{item}</SelectItem>
                                                ))}
                                            </Select>
                                            <Input
                                                name="phone"
                                                label="Phone"
                                                labelPlacement="outside"
                                                placeholder="050XXXXXXX"
                                                className="w-full"
                                                value={guardianInfo.phone ?? ""}
                                                onChange={handleGuardianInfoChange}
                                            />
                                            <Input
                                                name="postalAddress"
                                                label="Postal Address"
                                                labelPlacement="outside"
                                                placeholder="PO Box XXXX"
                                                className="w-full"
                                                value={guardianInfo.postalAddress ?? ""}
                                                onChange={handleGuardianInfoChange}
                                            />
                                            <Input
                                                name="houseNumber"
                                                label="House Number"
                                                labelPlacement="outside"
                                                placeholder="26"
                                                className="w-full"
                                                value={guardianInfo.houseNumber ?? ""}
                                                onChange={handleGuardianInfoChange}
                                            />
                                        </div>
                                    </>
                                    :
                                    modalAction === "view" ?
                                        <Card className="w-full">
                                            <CardHeader className="flex gap-3">
                                                <UserRound className="border border rounded-lg" size={40} />
                                                <div className="flex flex-col">
                                                    <p className="text-md">{capitalize(studentInfo.surname)} {capitalize(studentInfo.otherNames)}</p>
                                                    <p className="text-small text-default-500">{studentInfo.gender === "m" ? "Male" : "Female"} | {studentInfo.currentClass.name}</p>
                                                </div>
                                            </CardHeader>
                                            <Divider />
                                            <CardBody className="gap-4">
                                                <h1 className="font-bold">Personal</h1>
                                                <div className="mx-4">
                                                    <p><b>Surname</b>: {studentInfo.surname}</p>
                                                    <p><b>OtherNames</b>: {studentInfo.otherNames}</p>
                                                    <p><b>Gender</b>: {studentInfo.gender === "m" ? "Male" : "Female"}</p>
                                                    <p><b>Age</b>: {studentInfo.age ?? "N/A"}</p>
                                                    <p><b>Current Class</b>: {studentInfo.currentClass?.name}</p>
                                                    <p><b>Religion</b>: {studentInfo.religion}</p>
                                                    <p><b>DateOfBirth</b>: {new Date(studentInfo.dateOfBirth).toLocaleDateString()}</p>
                                                    <p><b>Place Of Birth</b>: {studentInfo.placeOfBirth ?? "N/A"}</p>
                                                </div>

                                                <h1 className="font-bold">Guardian Info</h1>
                                                <div className="mx-4">
                                                    {!guardianInfo.id ?
                                                        <div className="flex flex-row ju">
                                                            <p className="mx-4">Guardian info not found</p>
                                                        </div> :
                                                        <>
                                                            <p>Guardian Name: {guardianInfo.fullname || "N/A"}</p>
                                                            <p>Occupation: {guardianInfo.occupation || "N/A"}</p>
                                                            <p>Edu. Backgroub: {guardianInfo.educationalBackground || "N/A"}</p>
                                                            <p>Phone: {guardianInfo.phone || "N/A"}</p>
                                                            <p>Postal Add: {guardianInfo.postalAddress || "N/A"}</p>
                                                            <p>House No: {guardianInfo.houseNumber || "N/A"}</p>
                                                        </>
                                                    }
                                                </div>
                                            </CardBody>
                                            <Divider />
                                        </Card>
                                        : modalAction === "delete" ?
                                            <Card className="w-full">
                                                <CardHeader className="flex gap-3">
                                                    <UserRound className="border border rounded-lg" size={40} />
                                                    <div className="flex flex-col">
                                                        <p className="text-md">{studentInfo.surname} {studentInfo.otherNames}</p>
                                                        <p className="text-small text-default-500">{studentInfo.gender} | {studentInfo.currentClass?.name}</p>
                                                    </div>
                                                </CardHeader>
                                                <Divider />
                                                <CardBody className="gap-4">
                                                    <h1 className="">Are you sure you want to delete this student?</h1>
                                                    <Button className="color-brand-100" color="primary" onPress={() => handleDeleteStudent()}>
                                                        Confirm Delete
                                                    </Button>

                                                </CardBody>
                                                <Divider />
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
                                    <Button type="submit" color="primary" onPress={handleCreateNewStudent}>
                                        Submit
                                    </Button>
                                    : modalAction === "update" ?
                                        <Button onPress={handleUpdateStudentInfo} type="submit" color="primary">
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
