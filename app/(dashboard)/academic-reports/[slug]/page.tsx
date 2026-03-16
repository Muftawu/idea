"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { AuthContext } from "@/context/authContext"
import { ClassRoomSchemaT, ClassSubjectGroupT, StudentSchemaT } from "@/lib/schemas"
import { BaseRequestHeaders, capitalize, getSubjectGroupScoreOptions } from "@/lib/utils"
import { PlusCircle } from "lucide-react"
import { useContext, useState, useEffect, use } from "react"
import { Alert, Input, Select, SelectItem, Button, DatePicker, Spinner, Snippet } from "@heroui/react";
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
import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import { toast } from "react-toastify";
import { dynamicFormUpdates } from "@/lib/utils";

type classListProps = {
    scoreType: string,
    subjects: {
        id: string,
        subjectName: string,
    }[]
}

export default function AcademicReportPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const userData = useContext(AuthContext)

    if (!userData) return <Spinner label="Loading please wait" />

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

    const [pastAcademicRecords, setPastAcademicRecords] = useState([])
    const [classSubjectList, setClassSubjectList] = useState<classListProps>({
        scoreType: "",
        subjects: []
    })
    const [availableClasses, setAvailableClasses] = useState<ClassRoomSchemaT[]>([])
    const [isClassSubjectListFetched, setIsClassSubjectListFetched] = useState<boolean>(false)

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
                }
            } catch (err: any) {
            }
        }
        fetchStudentInfo()
    }, [])

    useEffect(() => {
        if (!studentInfo.currentClass.classGroup) return
        const group_name = studentInfo.currentClass.classGroup
        const fetchStudentCurrentClassSubjects = async () => {
            try {
                const response = await fetch(`/api/api-utils?query=${group_name}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    setClassSubjectList(result.data)
                    setClassSubjectList
                }
            } catch (err: any) {
            }
            setIsClassSubjectListFetched(true)
        }
        fetchStudentCurrentClassSubjects()
    }, [studentInfo.currentClass.classGroup])

    const handleOpenModal = (action: typeof modalAction, item?: any) => {
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

        onClose()
    }

    return (
        <div className="h-dvh">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">Student Info</h1>
                    <Button className="bg-brand cursor-pointer text-white" onPress={() => handleOpenModal("add")}>
                        <PlusCircle />
                        New Record
                    </Button>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-3">
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

                    {/* <div className="rounded-xl bg-background p-4 ring-1 ring-border"> */}
                    {/*     <div className="flex items-center gap-3"> */}
                    {/*         <Avatar className="size-12"> */}
                    {/*             <AvatarFallback className="text-lg">{userData.userInfo.userType.toUpperCase().at(0)}</AvatarFallback> */}
                    {/*         </Avatar> */}
                    {/*         <div> */}
                    {/*             <p className="font-medium text-foreground">{capitalize(userData.userInfo.userType)}</p> */}
                    {/*             <p className="text-sm text-muted-foreground">User Role</p> */}
                    {/*         </div> */}
                    {/*     </div> */}
                    {/* </div> */}
                </div>


                <div className="mt-8">
                    <p className="mt-2 text-muted-foreground">Past Academic Records ({pastAcademicRecords.length})</p>
                </div>

                <ul className="mt-6 divide-y divide-border">
                    {!pastAcademicRecords ?
                        <div className="flex flex-row ">
                            <Spinner size="sm" className="text-center" />
                            <p className="mx-4">Fetching staff data...</p>
                        </div>
                        :
                        pastAcademicRecords.length < 1 ? <p className="mx-4">No academic records available</p> :
                            pastAcademicRecords.map((item, index) => (
                                <li key={index} className="flex items-center gap-4 py-4">
                                    <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                        {/* {item.personalInfo?.first_name[0]}{item.personalInfo?.last_name[0]} */}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            {/* <p className="truncate font-medium text-foreground">{item.personalInfo?.first_name} {item.personalInfo?.last_name}</p> */}
                                            {/* <span className="text-xs text-muted-foreground">{t.studentCount}</span> */}
                                        </div>
                                        {/* <p className="truncate text-sm text-muted-foreground">Phone: {item.personalInfo?.phone}</p> */}
                                    </div>
                                    {/* <div className="flex flex-row justify-center items-center"> */}
                                    {/*     <Button size="sm" isIconOnly={true} className="color-brand-100 max-w-sm" color="primary" onPress={() => handleOpenModal("update", item)}> */}
                                    {/*         <Edit /> */}
                                    {/*     </Button> */}
                                    {/*     <Button isIconOnly={true} size="sm" className="color-brand-100 mx-2" color="primary" onPress={() => handleOpenModal("delete", item)}> */}
                                    {/*         <TrashIcon /> */}
                                    {/*     </Button> */}
                                    {/*     <Button isIconOnly={true} size="sm" className="color-brand-100" color="primary" onPress={() => handleOpenModal("view", item)}> */}
                                    {/*         <EyeIcon /> */}
                                    {/*     </Button> */}
                                    {/**/}
                                    {/* </div> */}
                                </li>
                            ))}
                </ul>
            </section>

            <Modal isOpen={isOpen} size="lg" backdrop="opaque" placement="center" onOpenChange={onOpenChange} className={`overflow-y-auto h-auto max-h-[50rem] mx-4 scrollbar-hide`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col bg-primary text-white">
                                {modalAction === "add" ? "New Academic Record" : modalAction === "view" || modalAction === "update" ? "Staff Info" : "Delete Staff"} <br />
                                {studentInfo.currentClass.name} {studentInfo.surname} {studentInfo.otherNames}
                            </ModalHeader>

                            <ModalBody className="gap-y-4 space-y-4">
                                {modalAction === "add" || modalAction === "update" ?
                                    <>

                                        <Alert className="mt-4" color="primary" variant="faded" title="All fields are required" />

                                        {!classSubjectList ? <Spinner label="Loading subjects. Please wait..." /> :

                                            classSubjectList?.scoreType === "options" ?
                                                classSubjectList?.subjects.map((item) => (
                                                    <div key={item.id} className="mx-4 gap-8 space-y-12">
                                                        <Select
                                                            name={item.id}
                                                            label={item.subjectName}
                                                            labelPlacement="outside"
                                                            selectedKeys={new Set([])}
                                                            placeholder="Select grade"
                                                        // onChange={handleStaffAssignedClassesChanged}
                                                        >
                                                            {getSubjectGroupScoreOptions(studentInfo.currentClass.classGroup).map((item, index) => (
                                                                <SelectItem key={index}>{item}</SelectItem>
                                                            ))}
                                                        </Select>
                                                    </div>
                                                ))
                                                :
                                                classSubjectList?.subjects.map((item) => (
                                                    <div key={item.id}>
                                                        <h1 className="mx-4">{item.subjectName}</h1>
                                                        <div className="flex flex-row justify-between items-center">
                                                            <Input
                                                                name={`${item.id}_class_score`}
                                                                label="Class Score"
                                                                labelPlacement="inside"
                                                                minLength={1}
                                                                maxLength={2}
                                                                validate={(val) => { if (Number(val) > 50) return "Score cannot exceed 50" }}
                                                                placeholder="0.0"
                                                                className="w-full mx-2"
                                                            // value={staffInfo.placeOfBirth ?? ""}
                                                            // onChange={handleStaffInfoChange}
                                                            />
                                                            <Input
                                                                name={`${item.id}_exam_score`}
                                                                label="Exam Score"
                                                                labelPlacement="inside"
                                                                minLength={1}
                                                                maxLength={2}
                                                                validate={(val) => { if (Number(val) > 50) return "Score cannot exceed 50" }}
                                                                placeholder="0.0"
                                                                className="w-full mx-2"
                                                            // value={staffInfo.placeOfBirth ?? ""}
                                                            // onChange={handleStaffInfoChange}
                                                            />

                                                        </div>
                                                    </div>
                                                ))
                                        }

                                        <Separator />
                                        {/* <p className="font-semibold">Academic Info</p> */}
                                        {/* <div className="mx-4 gap-8 space-y-12"> */}
                                        {/*     <Input */}
                                        {/*         name="placeOfBirth" */}
                                        {/*         label="Place of Birth" */}
                                        {/*         labelPlacement="outside" */}
                                        {/*         placeholder="Accra" */}
                                        {/*         className="w-full" */}
                                        {/*         value={staffInfo.placeOfBirth ?? ""} */}
                                        {/*         onChange={handleStaffInfoChange} */}
                                        {/*     /> */}
                                        {/*     <Select */}
                                        {/*         name="academicQualification" */}
                                        {/*         isRequired */}
                                        {/*         label="Academic Qualification" */}
                                        {/*         labelPlacement="outside" */}
                                        {/*         placeholder="Select qualification" */}
                                        {/*         selectedKeys={new Set(["wassce"])} */}
                                        {/*         value={staffInfo.academicQualification ?? ""} */}
                                        {/*         onChange={handleStaffInfoChange} */}
                                        {/*     > */}
                                        {/*         <SelectItem key="bachelor">Bachelor</SelectItem> */}
                                        {/*         <SelectItem key="hnd">Diploma</SelectItem> */}
                                        {/*         <SelectItem key="wassce">Wassce</SelectItem> */}
                                        {/*     </Select> */}
                                        {/* </div> */}
                                    </>
                                    :
                                    modalAction === "view" ?
                                        <Card className="w-full">
                                            {/* <CardHeader className="flex gap-3"> */}
                                            {/*     <UserRound className="border border rounded-lg" size={40} /> */}
                                            {/*     <div className="flex flex-col"> */}
                                            {/*         <p className="text-md">{staffInfo.personalInfo.first_name} {staffInfo.personalInfo.last_name}</p> */}
                                            {/*         <p className="text-small text-default-500">{staffInfo.personalInfo.email} | {staffInfo.personalInfo.phone}</p> */}
                                            {/*     </div> */}
                                            {/* </CardHeader> */}
                                            {/* <Divider /> */}
                                            {/* <CardBody className="gap-4"> */}
                                            {/*     {/* <p >Staff Id: {staffInfo.staffId}</p> */}
                                            {/**/}
                                            {/*     <h1 className="font-bold">Login Credentials</h1> */}
                                            {/*     <div className="mx-4"> */}
                                            {/*         <div className="flex flex-row justify-between"> */}
                                            {/*             <p className="text-small text-default-500">Username: <b>{staffInfo.staffCredentials.username}</b> </p> */}
                                            {/*             <Copy onClick={() => handleOnCopyStaffCredential("Username", staffInfo.staffCredentials.username)} className="w-5 mx-4 cursor-pointer hover:color-primary" size="sm" /> */}
                                            {/*         </div> */}
                                            {/*         <div className="flex flex-row justify-between"> */}
                                            {/*             <p className="text-small text-default-500">Password: <b>{staffInfo.staffCredentials.password}</b> </p> */}
                                            {/*             <Copy onClick={() => handleOnCopyStaffCredential("Password", staffInfo.staffCredentials.password)} className="w-5 mx-4 cursor-pointer hover:color-primary" size="sm" /> */}
                                            {/*         </div> */}
                                            {/*     </div> */}
                                            {/**/}
                                            {/*     <Divider /> */}
                                            {/**/}
                                            {/*     <h1 className="font-bold">Personal</h1> */}
                                            {/*     <div className="mx-4"> */}
                                            {/*         <p className="text-default-500">UserType: <b>{capitalize(staffInfo.personalInfo.userType) || "N/A"}</b></p> */}
                                            {/*         <p className="text-default-500">Gender: <b>{staffInfo.personalInfo.gender === "m" ? "Male" : "Female"}</b></p> */}
                                            {/*         <p className="text-default-500">Birth Place: <b>{staffInfo.placeOfBirth || "N/A"}</b></p> */}
                                            {/*         <p className="text-default-500">Residence: <b>{staffInfo.placeOfResidence || "N/A"}</b></p> */}
                                            {/*         <p className="text-default-500">Hometown: <b>{staffInfo.hometown || "N/A"}</b></p> */}
                                            {/*     </div> */}
                                            {/**/}
                                            {/*     <Divider /> */}
                                            {/**/}
                                            {/*     <h1 className="font-bold">Assigned Classes ({staffInfo.assignedClasses?.length})</h1> */}
                                            {/*     <div className="mx-4"> */}
                                            {/*         {staffInfo.assignedClasses?.map((item, index) => ( */}
                                            {/*             <p className="text-default-500" key={index}>Name: <b>{item.name ?? "N/A"}</b></p> */}
                                            {/*         ))} */}
                                            {/*     </div> */}
                                            {/**/}
                                            {/*     <Divider /> */}
                                            {/*     <h1 className="font-bold">Qualification</h1> */}
                                            {/*     <div className="mx-4"> */}
                                            {/*         <p className="text-default-500">Academic: <b>{staffInfo.academicQualification || "N/A"}</b></p> */}
                                            {/*         <p className="text-default-500">Professional: <b>{staffInfo.professionalQualification || "N/A"}</b></p> */}
                                            {/*     </div> */}
                                            {/**/}
                                            {/*     <Divider /> */}
                                            {/**/}
                                            {/*     <h1 className="font-bold">Accounts</h1> */}
                                            {/*     <div className="mx-4"> */}
                                            {/*         <p className="text-default-500">Bank Acc No: <b>{staffInfo.bankAccNo || "N/A"}</b></p> */}
                                            {/*         <p className="text-default-500">Social Sec No: <b>{staffInfo.socialSecNo || "N/A"}</b></p> */}
                                            {/**/}
                                            {/*     </div> */}
                                            {/* </CardBody> */}
                                            {/* <Divider /> */}
                                            {/* {/* <CardFooter> */}
                                            {/* {/*     <Link isExternal showAnchorIcon href="https://github.com/heroui-inc/heroui"> */}
                                            {/* {/*         Visit source code on GitHub. */}
                                            {/* {/*     </Link> */}
                                            {/* </CardFooter> */}
                                        </Card>
                                        : modalAction === "delete" ?
                                            <Card className="w-full">
                                                {/* <CardHeader className="flex gap-3"> */}
                                                {/*     <UserRound className="border border rounded-lg" size={40} /> */}
                                                {/*     <div className="flex flex-col"> */}
                                                {/*         <p className="text-md">{staffInfo.personalInfo.first_name} {staffInfo.personalInfo.last_name}</p> */}
                                                {/*         <p className="text-small text-default-500">{staffInfo.personalInfo.email} | {staffInfo.personalInfo.phone}</p> */}
                                                {/*     </div> */}
                                                {/* </CardHeader> */}
                                                {/* <Divider /> */}
                                                {/* <CardBody className="gap-4"> */}
                                                {/*     <h1 className="">Are you sure you want to delete this staff ?</h1> */}
                                                {/**/}
                                                {/*     <Button className="color-brand-100" color="primary" onPress={() => handleDeleteStaff()}> */}
                                                {/*         Confirm Delete */}
                                                {/*     </Button> */}
                                                {/**/}
                                                {/* </CardBody> */}
                                                {/* <Divider /> */}
                                            </Card>
                                            :
                                            null
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="default" variant="flat" onPress={() => handleOnCloseModal()}>
                                    Close
                                </Button>
                                {/* {modalAction === "add" ? */}
                                {/*     <Button type="submit" color="primary" onPress={handleCreateNewStaff}> */}
                                {/*         Submit */}
                                {/*     </Button> */}
                                {/*     : modalAction === "update" ? */}
                                {/*         <Button type="submit" color="primary" onPress={handleUpdateStaffInfo}> */}
                                {/*             Save Changes */}
                                {/*         </Button> */}
                                {/*         : null */}
                                {/* } */}
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </div >
    )
}
