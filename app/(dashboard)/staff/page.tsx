"use client"
import { DateValue } from "@heroui/react";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date"
import { PlusCircle, EyeIcon, UserRound, TrashIcon, Edit, Copy } from "lucide-react"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { StaffT, StaffStatSchemaT } from "@/lib/schemas"
import { Input, Select, SelectItem, Button, DatePicker, Spinner } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Separator } from "@/components/ui/separator"
import StaffStatistics from "@/components/dashboard/staff/staff-stats"
import { BaseErrMsg, BaseRequestHeaders } from "@/lib/utils";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { toast } from "react-toastify";
import { dynamicFormUpdates } from "@/lib/utils";

export default function Staff() {

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState<boolean>(false)

    const [allStaff, setAllStaff] = useState<StaffT[]>([])
    const [staffFetched, setStaffFetched] = useState<boolean>(false)
    const [modalAction, setModalAction] = useState<"view" | "add" | "delete" | "update">("view")
    const [staffStats, setStaffStats] = useState<StaffStatSchemaT>({
        maleCount: 0,
        femaleCount: 0,
        malePercentage: 0,
        femalePercentage: 0
    })
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
    const staffUpdates = useRef<dynamicFormUpdates[]>([])

    useEffect(() => {
        const fetchStaffStats = async () => {
            try {
                const response = await fetch(`/api/stats?query=staff`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    setStaffStats(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchStaffStats()
    }, [loading])

    useEffect(() => {
        const fetchAllStaff = async () => {
            try {
                const response = await fetch(`/api/staff?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    setStaffFetched(false)
                    return Promise.reject(response.status)
                } else {
                    setAllStaff(result.data)
                    setStaffFetched(true)
                }
            } catch (err: any) {
            }
        }
        fetchAllStaff()
    }, [loading])

    async function handleCreateNewStaff() {
        onClose()
        const fn = async () => {
            try {
                const response = await fetch("/api/staff", {
                    method: "POST",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify(staffInfo)
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
                pending: "Creating staff...",
                success: "Staff successfully created",
                error: BaseErrMsg
            }
        )
        handleOnCloseModal()
        setLoading(false)
    }

    async function handleDeleteStaff() {
        onClose()
        const fn = async () => {
            try {
                const response = await fetch(`/api/staff?query=${staffInfo.id}`, {
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
                pending: "Deleting staff...",
                success: "Staff successfully deleted",
                error: BaseErrMsg
            }
        )
        setLoading(false)
    }

    function handleOpenModal(action: typeof modalAction, item?: StaffT) {
        if (!action) return
        setModalAction(action)
        { item ? setStaffInfo(item) : null }
        onOpen()
    }

    function handleOnCloseModal() {
        setStaffInfo({
            personalInfo: {
                first_name: "",
                last_name: "",
                email: "",
                dateOfBirth: new Date(),
                userType: "",
                phone: "",
                gender: "f"
            },
            staffId: "",
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
        onClose()
    }

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (modalAction === "update") {
            const updates = staffUpdates.current
            const fieldExists = updates.find(obj => obj.field === e.target.name)
            if (fieldExists) {
                fieldExists.value = e.target.value
            } else {
                staffUpdates.current.push({ field: e.target.name, value: e.target.value })
            }
        }
        setStaffInfo({ ...staffInfo, personalInfo: { ...staffInfo.personalInfo, [e.target.name]: e.target.value } })
    }

    const handleStaffInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (modalAction === "update") {
            const updates = staffUpdates.current
            const fieldExists = updates.find(obj => obj.field === e.target.name)
            if (fieldExists) {
                fieldExists.value = e.target.value
            } else {
                staffUpdates.current.push({ field: e.target.name, value: e.target.value })
            }
        }
        setStaffInfo({ ...staffInfo, [e.target.name]: e.target.value })
    }

    const handleUpdateStaffInfo = async () => {
        onClose()
        if (staffUpdates.current.length < 1) return toast.info("No changes made")

        let personalInfoFieldUpdates = {}
        let staffInfoFieldUpdates = {}
        const personalInfoFormFields = ["first_name", "last_name", "email", "phone", "gender", "nationality", "dateOfBirth"]
        const payload = staffUpdates.current.map(({ field, value }) => ({ [field]: value }))

        for (var item in payload) {
            const [[k, v]] = Object.entries(payload[item])
            if (personalInfoFormFields.includes(k)) {
                personalInfoFieldUpdates = { ...personalInfoFieldUpdates, [k]: v }
            } else {
                staffInfoFieldUpdates = { ...staffInfoFieldUpdates, [k]: v }
            }
        }
        const jsonData = { id: staffInfo.id, personalInfo: personalInfoFieldUpdates, staffInfo: staffInfoFieldUpdates }

        const fn = async () => {
            try {
                const response = await fetch("/api/staff", {
                    method: "PATCH",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify(jsonData)
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
                pending: "Updating staff info...",
                success: "Staff info successfully updated",
                error: BaseErrMsg
            }
        )
        handleOnCloseModal()
        setLoading(false)
        staffUpdates.current = []
    }

    const handleOnCopyStaffCredential = async (info: string, text: string) => {
        if (!info || !text) return
        try {
            await navigator.clipboard.writeText(text)
            toast.info(`${info} copied`)
        } catch (err: any) {
        }
    }

    return (
        <div className="lg:h-dvh h-auto">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border mb-4">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">Academic Staff</h1>
                    <Button className="bg-brand cursor-pointer text-white" onPress={() => handleOpenModal("add")}>
                        <PlusCircle />
                        Add Staff
                    </Button>
                </div>

                <StaffStatistics data={staffStats} className="" />

                <div className="mt-8">
                    <p className="mt-2 text-muted-foreground">All Staff ({allStaff.length})</p>
                </div>

                <ul className="mt-6 divide-y divide-border">
                    {!staffFetched ?
                        <div className="flex flex-row ">
                            <Spinner size="sm" className="text-center" />
                            <p className="mx-4">Fetching staff data...</p>
                        </div>
                        :
                        allStaff.length < 1 ? <p className="mx-4">No staff available</p> :
                            allStaff.map((item, index) => (
                                <li key={index} className="flex items-center gap-4 py-4">
                                    <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                        {item.personalInfo?.first_name[0]}{item.personalInfo?.last_name[0]}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate font-medium text-foreground">{item.personalInfo?.first_name} {item.personalInfo?.last_name}</p>
                                            {/* <span className="text-xs text-muted-foreground">{t.studentCount}</span> */}
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">Phone: {item.personalInfo?.phone}</p>
                                    </div>
                                    <div className="flex flex-row justify-center items-center">
                                        <Button size="sm" isIconOnly={true} className="color-brand-100 max-w-sm" color="primary" onPress={() => handleOpenModal("update", item)}>
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
                </ul>
            </section>

            <Modal isOpen={isOpen} size="lg" backdrop="opaque" placement="center" onOpenChange={onOpenChange} className={`overflow-y-auto h-auto max-h-[50rem] mx-4`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col bg-primary text-white">
                                {modalAction === "add" ?
                                    "Add New Staff" : modalAction === "view" || modalAction === "update" ? "Staff Info" : "Delete Staff"}
                            </ModalHeader>

                            <ModalBody className="">
                                {modalAction === "add" || modalAction === "update" ?
                                    <>
                                        <p className="font-semibold">Personal Info</p>
                                        <div className="mx-4 gap-8 space-y-12 mb-4">
                                            <Input
                                                isRequired
                                                name="first_name"
                                                label="First Name"
                                                labelPlacement="outside"
                                                placeholder="John"
                                                className="w-full"
                                                value={staffInfo.personalInfo.first_name}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <Input
                                                isRequired
                                                name="last_name"
                                                label="Last Name"
                                                labelPlacement="outside"
                                                placeholder="Doe"
                                                className="w-full"
                                                value={staffInfo.personalInfo.last_name}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <Input
                                                type="email"
                                                name="email"
                                                isRequired
                                                label="Email"
                                                labelPlacement="outside"
                                                placeholder="user@gmail.com"
                                                className="w-full"
                                                value={staffInfo.personalInfo.email}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <Input
                                                isRequired
                                                name="phone"
                                                label="Phone"
                                                labelPlacement="outside"
                                                placeholder="024XXXXXXXX"
                                                className="w-full"
                                                value={staffInfo.personalInfo.phone}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <DatePicker
                                                label="Date of Birth"
                                                labelPlacement="outside"
                                                isRequired
                                                value={
                                                    staffInfo.personalInfo.dateOfBirth
                                                        ? new CalendarDate(
                                                            new Date(staffInfo.personalInfo.dateOfBirth).getFullYear(),
                                                            new Date(staffInfo.personalInfo.dateOfBirth).getMonth() + 1,
                                                            new Date(staffInfo.personalInfo.dateOfBirth).getDate()
                                                        ) as unknown as DateValue
                                                        : new CalendarDate(1996, 5, 15) as unknown as DateValue
                                                }
                                                placeholderValue={new CalendarDate(1996, 5, 15) as unknown as DateValue}
                                                onChange={(value) => setStaffInfo({
                                                    ...staffInfo,
                                                    personalInfo: { ...staffInfo.personalInfo, dateOfBirth: value ? value.toDate(getLocalTimeZone()) : new Date() }
                                                })}
                                            />
                                            <Select
                                                name="nationality"
                                                isRequired
                                                label="Nationality"
                                                labelPlacement="outside"
                                                placeholder="Select nationality"
                                                selectedKeys={new Set(["gh"])}
                                                value={staffInfo.personalInfo.nationality}
                                                onChange={handlePersonalInfoChange}
                                            >
                                                <SelectItem key="gh">Ghanaian</SelectItem>
                                                <SelectItem key="ngn">Nigerian</SelectItem>
                                                <SelectItem key="other">Other</SelectItem>
                                            </Select>
                                            <Select
                                                isRequired
                                                label="Gender"
                                                labelPlacement="outside"
                                                name="gender"
                                                placeholder="Select gender"
                                                value={staffInfo.personalInfo.gender}
                                                onChange={handlePersonalInfoChange}
                                            >
                                                <SelectItem key="m">Male</SelectItem>
                                                <SelectItem key="f">Female</SelectItem>
                                            </Select>
                                        </div>

                                        <Separator />
                                        <p className="font-semibold">Academic Info</p>
                                        <div className="mx-4 gap-8 space-y-12">
                                            <Input
                                                name="placeOfBirth"
                                                label="Place of Birth"
                                                labelPlacement="outside"
                                                placeholder="Accra"
                                                className="w-full"
                                                value={staffInfo.placeOfBirth}
                                                onChange={handleStaffInfoChange}
                                            />
                                            <Select
                                                name="academicQualification"
                                                isRequired
                                                label="Academic Qualification"
                                                labelPlacement="outside"
                                                placeholder="Select qualification"
                                                selectedKeys={new Set(["wassce"])}
                                                value={staffInfo.academicQualification}
                                                onChange={handleStaffInfoChange}
                                            >
                                                <SelectItem key="bachelor">Bachelor</SelectItem>
                                                <SelectItem key="hnd">Diploma</SelectItem>
                                                <SelectItem key="wassce">Wassce</SelectItem>
                                            </Select>
                                            <Input
                                                name="professionalQualification"
                                                label="Professional Qualification"
                                                labelPlacement="outside"
                                                placeholder="Teacher"
                                                className="w-full"
                                                value={staffInfo.professionalQualification}
                                                onChange={handleStaffInfoChange}
                                            />
                                            <Input
                                                name="placeOfResidence"
                                                label="Residence"
                                                labelPlacement="outside"
                                                placeholder="Kasoa"
                                                className="w-full"
                                                value={staffInfo.placeOfResidence}
                                                onChange={handleStaffInfoChange}
                                            />
                                            <Input
                                                name="hometown"
                                                label="Hometown"
                                                labelPlacement="outside"
                                                placeholder="Ho"
                                                className="w-full"
                                                value={staffInfo.hometown ?? ""}
                                                onChange={handleStaffInfoChange}
                                            />
                                            <Input
                                                name="bankAccNo"
                                                label="Bank Acc No"
                                                labelPlacement="outside"
                                                placeholder="XXXX-XXX-XXXXX"
                                                className="w-full"
                                                value={staffInfo.bankAccNo ?? ""}
                                                onChange={handleStaffInfoChange}
                                            />
                                            <Input
                                                name="socialSecNo"
                                                label="Social Security No"
                                                labelPlacement="outside"
                                                placeholder="SSN-XXX-XXX-XXX"
                                                className="w-full"
                                                value={staffInfo.socialSecNo ?? ""}
                                                onChange={handleStaffInfoChange}
                                            />
                                        </div>
                                    </>
                                    :
                                    modalAction === "view" ?
                                        <Card className="w-full">
                                            <CardHeader className="flex gap-3">
                                                <UserRound className="border border rounded-lg" size={40} />
                                                <div className="flex flex-col">
                                                    <p className="text-md">{staffInfo.personalInfo.first_name} {staffInfo.personalInfo.last_name}</p>
                                                    <p className="text-small text-default-500">{staffInfo.personalInfo.email} | {staffInfo.personalInfo.phone}</p>
                                                </div>
                                            </CardHeader>
                                            <Divider />
                                            <CardBody className="gap-4">
                                                {/* <p >Staff Id: {staffInfo.staffId}</p> */}

                                                <h1 className="font-bold">Login Credentials</h1>
                                                <div className="mx-4">
                                                    <div className="flex flex-row justify-between">
                                                        <p className="text-small text-default-500">Username: <b>{staffInfo.staffCredentials.username}</b> </p>
                                                        <Copy onClick={() => handleOnCopyStaffCredential("Username", staffInfo.staffCredentials.username)} className="w-5 mx-4 cursor-pointer hover:color-primary" size="sm" />
                                                    </div>
                                                    <div className="flex flex-row justify-between">
                                                        <p className="text-small text-default-500">Password: <b>{staffInfo.staffCredentials.password}</b> </p>
                                                        <Copy onClick={() => handleOnCopyStaffCredential("Password", staffInfo.staffCredentials.password)} className="w-5 mx-4 cursor-pointer hover:color-primary" size="sm" />
                                                    </div>
                                                </div>


                                                <h1 className="font-bold">Personal</h1>
                                                <div className="mx-4">
                                                    <p>Gender: {staffInfo.personalInfo.gender === "m" ? "Male" : "Female"}</p>
                                                    <p>Birth Place: {staffInfo.placeOfBirth || "N/A"}</p>
                                                    <p>Residence: {staffInfo.placeOfResidence || "N/A"}</p>
                                                    <p>Hometown: {staffInfo.hometown || "N/A"}</p>
                                                </div>

                                                <h1 className="font-bold">Qualification</h1>
                                                <div className="mx-4">
                                                    <p>Academic: {staffInfo.academicQualification || "N/A"}</p>
                                                    <p>Professional: {staffInfo.professionalQualification || "N/A"}</p>
                                                </div>

                                                <h1 className="font-bold">Accounts</h1>
                                                <div className="mx-4">
                                                    <p>Bank Acc No: {staffInfo.bankAccNo || "N/A"}</p>
                                                    <p>Social Sec No: {staffInfo.socialSecNo || "N/A"}</p>
                                                </div>
                                            </CardBody>
                                            <Divider />
                                            {/* <CardFooter> */}
                                            {/*     <Link isExternal showAnchorIcon href="https://github.com/heroui-inc/heroui"> */}
                                            {/*         Visit source code on GitHub. */}
                                            {/*     </Link> */}
                                            {/* </CardFooter> */}
                                        </Card>
                                        : modalAction === "delete" ?
                                            <Card className="w-full">
                                                <CardHeader className="flex gap-3">
                                                    <UserRound className="border border rounded-lg" size={40} />
                                                    <div className="flex flex-col">
                                                        <p className="text-md">{staffInfo.personalInfo.first_name} {staffInfo.personalInfo.last_name}</p>
                                                        <p className="text-small text-default-500">{staffInfo.personalInfo.email} | {staffInfo.personalInfo.phone}</p>
                                                    </div>
                                                </CardHeader>
                                                <Divider />
                                                <CardBody className="gap-4">
                                                    <h1 className="">Are you sure you want to delete this staff ?</h1>

                                                    <Button className="color-brand-100" color="primary" onPress={() => handleDeleteStaff()}>
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
                                    <Button type="submit" color="primary" onPress={handleCreateNewStaff}>
                                        Submit
                                    </Button>
                                    : modalAction === "update" ?
                                        <Button type="submit" color="primary" onPress={handleUpdateStaffInfo}>
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
