"use client"

import { useEffect, useState } from "react"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { BaseRequestHeaders } from "@/lib/utils"
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { PlusCircle, EyeIcon, Edit, TrashIcon, UserRound } from "lucide-react"
import { ClassRoomSchemaT, GuardianSchemaT, MinimalStudentInfoSchemaT, StaffT, StudentSchemaT, StudentStatsSchemaT, UserSchemaT } from "@/lib/schemas"
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

    const router = useRouter()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [modalAction, setModalAction] = useState<"view" | "add" | "delete" | "update">("view")

    const [staffDetail, setStaffDetail] = useState<StaffT>({
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

    // collection
    const [staffDetailsFetched, setStaffDetailsFetched] = useState<boolean>(false)
    const [retrievedAssignedClasses, setRetrievedAssignedClasses] = useState<ClassRoomSchemaT[]>([])
    const [allHandledStudentsClassList, setAllHandledStudentsClassList] = useState<Record<string, MinimalStudentInfoSchemaT[]>>({})
    const [currentClassList, setCurrentClassList] = useState<MinimalStudentInfoSchemaT[]>([])

    // single
    const [classInfo, setClassInfo] = useState<ClassRoomSchemaT>()
    const [studentInfo, setStudentInfo] = useState<StudentSchemaT[]>([])
    const [academicRecordInfo, setAcademicRecordInfo] = useState([])

    useEffect(() => {
        if (!userInfo.userTypeId || userInfo.userTypeId.trim().length < 1) return
        const fetchStaffDetails = async () => {
            try {
                const response = await fetch(`/api/staff?query=${userInfo.userTypeId}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    setStaffDetailsFetched(false)
                } else {
                    setRetrievedAssignedClasses(result.data.assignedClasses)
                    setAllHandledStudentsClassList(result.data.assignedClassStudentsList)
                    setStaffDetailsFetched(true)
                }
            } catch (err: any) {
                setStaffDetailsFetched(false)
            }
        }
        fetchStaffDetails()
    }, [])


    const handleViewClassList = (item: ClassRoomSchemaT) => {
        if (!item) return
        setClassInfo(item)
        const entries = Object.entries(allHandledStudentsClassList)
        entries.filter((ent) => ent[0] === item.id ? setCurrentClassList(ent[1]) : null)
        onOpen()
    }

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

                <h1 className="text-lg mb-4">Your Handled Classes ({retrievedAssignedClasses?.length ?? 0})</h1>
                <ul className="mt-6 divide-y divide-border">
                    {!staffDetailsFetched ?
                        <div className="flex flex-row ">
                            <Spinner size="sm" className="text-center" />
                            <p className="mx-4">Fetching classes...</p>
                        </div>
                        :
                        retrievedAssignedClasses?.length < 1 ? <div className="mx-4"><Alert color="primary" title="No assigned class. Please contact your school head" /> </div> :
                            retrievedAssignedClasses?.map((item, index) => (
                                <li key={index} className="flex items-center gap-4 py-4">
                                    <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                        {item.name[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate font-medium text-foreground">{item.name}</p>
                                            {/* <span className="text-xs text-muted-foreground">{t.studentCount}</span> */}
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">Class size: {item.studentCount}</p>
                                    </div>
                                    <div className="flex flex-row justify-center items-center">
                                        <Button isIconOnly={true} size="sm" className="color-brand-100" color="primary" onPress={() => handleViewClassList(item)}>
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
                                {classInfo?.name} class list ({currentClassList.length})
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
                                        currentClassList.map((item: MinimalStudentInfoSchemaT, index: number) => (
                                            <Card key={index} className="w-full">
                                                <CardHeader className="flex flex-row justify-between items-center gap-3">
                                                    <div className="flex flex-row">
                                                        <UserRound className="border border rounded-lg" size={40} />
                                                        <h1 className="font-bold m-2 mx-4">{index + 1}. {item.student__surname} {item.student__otherNames}</h1>
                                                    </div>
                                                    <Button onPress={() => router.push(`/academic-reports/${item.student_id}`)} isIconOnly={true} className="color-brand-100" color="primary">
                                                        <EyeIcon />
                                                    </Button>
                                                </CardHeader>
                                                <Divider />
                                                <Divider />
                                            </Card>
                                        ))
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
