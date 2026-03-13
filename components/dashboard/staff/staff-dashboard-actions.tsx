"use client"

import { useEffect, useState } from "react"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { BaseRequestHeaders } from "@/lib/utils"
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { PlusCircle, EyeIcon, Edit, TrashIcon, UserRound } from "lucide-react"
import { ClassRoomSchemaT, GuardianSchemaT, StaffT, StudentSchemaT, StudentStatsSchemaT, UserSchemaT } from "@/lib/schemas"
import { Input, Select, SelectItem, Button, DatePicker, Alert, Spinner } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export const StaffDashboardActions = ({ userInfo }: { userInfo: UserSchemaT }) => {

    if (!userInfo || !userInfo.userTypeId) return
    //     (
    //     <div className="flex flex-row">
    //         <Spinner label="Loading info. Please wait..." />
    //         <p>Loading info. Please wait...</p>
    //     </div>
    // )

    const router = useRouter()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [modalAction, setModalAction] = useState<"view" | "add" | "delete" | "update">("view")

    // collection
    const [handledClassesFetched, setHandldClassesFetched] = useState<boolean>(false)
    const [handledClasses, setHandledClasses] = useState<ClassRoomSchemaT[]>([])
    const [staffInfo, setStaffInfo] = useState<StaffT>({
        staffId: "",
        personalInfo: {
            first_name: "",
            last_name: "",
            userType: "",
            email: "",
            dateOfBirth: new Date(),
            phone: "",
            gender: "f"
        },
        staffCredentials: {
            username: "",
            password: ""
        },
        placeOfBirth: "",
        academicQualification: "",
        professionalQualification: "",
        placeOfResidence: "",
        hometown: "",
        bankAccNo: "",
        socialSecNo: "",
    })

    // single
    // const [classInfo, setClassInfo] = useState<ClassRoomSchemaT[]>([])
    // const [studentInfo, setStudentInfo] = useState<StudentSchemaT[]>([])
    // const [academicRecordInfo, setAcademicRecordInfo] = useState([])

    useEffect(() => {
        if (!userInfo.userTypeId || userInfo.userTypeId.trim().length < 1) return
        const fetchStaffInfo = async () => {
            try {
                const response = await fetch(`/api/staff?query=${userInfo.userTypeId}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                console.log("result", result.data)
                if (!response.ok) {
                    setHandldClassesFetched(false)
                    return Promise.reject(response.status)
                } else {
                    setHandledClasses(result.data)
                }
            } catch (err: any) {
                setHandldClassesFetched(false)
            }
        }
        fetchStaffInfo()
    }, [])


    const handleOnOpenModal = (action: string) => {
        if (!action) return
        onOpen()
    }

    const handleOnCloseModal = () => {
        onClose()
    }

    const handleOnAcademicRecordFieldChanges = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    }

    const handleCreateAcademicRecord = async () => {

    }

    const handleUpdateAcademicRecord = async () => {

    }

    return (
        <>
            <section className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border">

                <h1 className="mb-4">Handled Classes ({handledClasses.length})</h1>
                <ul className="mt-6 divide-y divide-border">
                    {!handledClassesFetched ?
                        <div className="flex flex-row ">
                            <Spinner size="sm" className="text-center" />
                            <p className="mx-4">Fetching staff data...</p>
                        </div>
                        :
                        handledClasses.length < 1 ? <p className="mx-4">No assigned class</p> :
                            handledClasses.map((item, index) => (
                                <li key={index} className="flex items-center gap-4 py-4">
                                    <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                        {item.name[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate font-medium text-foreground">{item.name}</p>
                                            {/* <span className="text-xs text-muted-foreground">{t.studentCount}</span> */}
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">Phone: {item.studentCount}</p>
                                    </div>
                                    <div className="flex flex-row justify-center items-center">
                                        <Button isIconOnly={true} size="sm" className="color-brand-100" color="primary" onPress={() => handleOnOpenModal("classList")}>
                                            <EyeIcon />
                                        </Button>

                                    </div>
                                </li>
                            ))}
                </ul>

            </section >

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
                                        {/* <div className="mx-4 gap-8 space-y-12 mb-4"> */}
                                        {/*     <Input */}
                                        {/*         isRequired */}
                                        {/*         name="surname" */}
                                        {/*         label="Surname" */}
                                        {/*         labelPlacement="outside" */}
                                        {/*         placeholder="John" */}
                                        {/*         className="w-full" */}
                                        {/*         value={studentInfo.surname} */}
                                        {/*         onChange={handleStudentInfoChange} */}
                                        {/*     /> */}
                                        {/*     <Select */}
                                        {/*         name="nationality" */}
                                        {/*         isRequired */}
                                        {/*         label="Nationality" */}
                                        {/*         labelPlacement="outside" */}
                                        {/*         placeholder="Select nationality" */}
                                        {/*         selectedKeys={new Set(["Ghanaian"])} */}
                                        {/*         value={studentInfo.nationality} */}
                                        {/*         defaultSelectedKeys={[studentInfo.nationality]} */}
                                        {/*         onChange={handleStudentInfoChange} */}
                                        {/*     > */}
                                        {/*         {Nationalities.map((item) => ( */}
                                        {/*             <SelectItem key={item}>{item}</SelectItem> */}
                                        {/*         ))} */}
                                        {/* </div> */}
                                    </>
                                    :
                                    modalAction === "view" ?
                                        <Card className="w-full">
                                            <CardHeader className="flex gap-3">
                                                <UserRound className="border border rounded-lg" size={40} />
                                                {/* <div className="flex flex-col"> */}
                                                {/*     <p className="text-md">{capitalize(studentInfo.surname)} {capitalize(studentInfo.otherNames)}</p> */}
                                                {/*     <p className="text-small text-default-500">{studentInfo.gender} | {studentInfo.currentClass.name}</p> */}
                                                {/* </div> */}
                                            </CardHeader>
                                            <Divider />
                                            <CardBody className="gap-4">
                                                <h1 className="font-bold">Personal</h1>
                                                {/* <div className="mx-4"> */}
                                                {/*     <p><b>Surname</b>: {studentInfo.surname}</p> */}
                                                {/*     <p><b>OtherNames</b>: {studentInfo.otherNames}</p> */}
                                                {/*     <p><b>Gender</b>: {studentInfo.gender === "m" ? "Male" : "Female"}</p> */}
                                                {/*     <p><b>Age</b>: {studentInfo.age}</p> */}
                                                {/*     <p><b>Current Class</b>: {studentInfo.currentClass?.name}</p> */}
                                                {/*     <p><b>Religion</b>: {studentInfo.religion}</p> */}
                                                {/*     <p><b>DateOfBirth</b>: {new Date(studentInfo.dateOfBirth).toLocaleDateString()}</p> */}
                                                {/*     <p><b>Place Of Birth</b>: {studentInfo.placeOfBirth}</p> */}
                                                {/* </div> */}
                                            </CardBody>
                                            <Divider />
                                        </Card>
                                        : modalAction === "delete" ?
                                            <Card className="w-full">
                                                <CardHeader className="flex gap-3">
                                                    <UserRound className="border border rounded-lg" size={40} />
                                                    {/* <div className="flex flex-col"> */}
                                                    {/*     <p className="text-md">{studentInfo.surname} {studentInfo.otherNames}</p> */}
                                                    {/*     <p className="text-small text-default-500">{studentInfo.gender} | {studentInfo.currentClass?.name}</p> */}
                                                    {/* </div> */}
                                                </CardHeader>
                                                <Divider />
                                                <CardBody className="gap-4">
                                                    <h1 className="">Are you sure you want to delete this student?</h1>
                                                    <Button className="color-brand-100" color="primary" onPress={() => { }}>
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
                                    <Button type="submit" color="primary" onPress={handleCreateAcademicRecord}>
                                        Submit
                                    </Button>
                                    : modalAction === "update" ?
                                        <Button onPress={handleUpdateAcademicRecord} type="submit" color="primary">
                                            Save Changes
                                        </Button>
                                        : null
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
