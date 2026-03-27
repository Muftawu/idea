"use client"
import { DateValue } from "@heroui/react";
import { getLocalTimeZone, CalendarDate } from "@internationalized/date"
import { PlusCircle, EyeIcon, UserRound, TrashIcon, Edit, Copy } from "lucide-react"
import React from "react"
import { useState, useEffect, useRef } from "react"
import { ClassRoomSchemaT, NonTeachingStaffSchemaT, NonTeachingStaffStatSchemaT } from "@/lib/schemas"
import { Alert, Input, Select, SelectItem, Button, DatePicker, Spinner, Textarea } from "@heroui/react";
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
import { BaseErrMsg, BaseRequestHeaders, capitalize } from "@/lib/utils";
import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import { toast } from "react-toastify";
import { dynamicFormUpdates } from "@/lib/utils";

export default function Staff() {

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState<boolean>(false)

    const [allStaff, setAllStaff] = useState<NonTeachingStaffSchemaT[]>([])
    const [staffFetched, setStaffFetched] = useState<boolean>(false)
    const [modalAction, setModalAction] = useState<"view" | "add" | "delete" | "update">("view")
    const [staffStats, setStaffStats] = useState<NonTeachingStaffStatSchemaT>({
        maleCount: 0,
        femaleCount: 0,
        malePercentage: 0,
        femalePercentage: 0
    })
    const [staffInfo, setStaffInfo] = useState<NonTeachingStaffSchemaT>({
        surname: "",
        phone: "",
        otherNames: "",
        dateOfBirth: new Date(),
        nationality: "",
        placeOfBirth: "",
        religion: "",
        gender: "",
    })

    type multiSelectFormFieldProp = {
        key?: string,
        label?: string
    }

    const staffUpdates = useRef<dynamicFormUpdates[]>([])

    const [staffAssignedClasses, setStaffAssignedClasses] = useState<string>("")

    useEffect(() => {
        const fetchStaffStats = async () => {
            try {
                const response = await fetch(`/api/stats?query=non-teaching-staff`, {
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
                const response = await fetch(`/api/non-teaching-staff?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    setStaffFetched(false)
                } else {
                    setAllStaff(result.data)
                    setStaffFetched(true)
                }
            } catch (err: any) {
            }
        }
        fetchAllStaff()
    }, [loading])

    function handleOpenModal(action: typeof modalAction, item?: NonTeachingStaffSchemaT) {
        if (!action) return
        setModalAction(action)
        if (action !== "add" && item) {
            // const assignedClasses: string[] = item.assignedClasses?.map(({ id }) => `${id}`) ?? []
            // setDefaultSelectedAssignedClasses(assignedClasses)
            // setStaffAssignedClasses(assignedClasses?.join())
            setStaffInfo(item)
        } else {
            handleOnCloseModal()
        }
        onOpen()
    }

    function handleOnCloseModal() {
        setStaffAssignedClasses("")
        setStaffInfo({
            surname: "",
            otherNames: "",
            dateOfBirth: new Date(),
            nationality: "",
            phone: "",
            placeOfBirth: "",
            religion: "",
            gender: "",
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
        setStaffInfo({ ...staffInfo, [e.target.name]: e.target.value })
    }

    const handleCreateNewStaff = async () => {
        console.log("staff info", staffInfo)
        const data = { ...staffInfo, dateOfBirth: new Date(staffInfo.dateOfBirth).toISOString().split("T")[0] }
        const fn = async () => {
            try {
                const response = await fetch("/api/non-teaching-staff", {
                    method: "POST",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify({ staffInfo: data })
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
                pending: "Creating non-teaching staff...",
                success: "Non-teaching Staff successfully created",
                error: BaseErrMsg
            }
        )
        handleOnCloseModal()
        setLoading(false)
    }

    const handleDeleteStaff = async () => {
        onClose()
        const fn = async () => {
            try {
                const response = await fetch(`/api/non-teaching-staff?query=${staffInfo.id}`, {
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
                success: "Non-teaching Staff successfully deleted",
                error: BaseErrMsg
            }
        )
        setLoading(false)
    }
    const handleUpdateStaffInfo = async () => {
        onClose()
        if (staffUpdates.current.length < 1 && staffAssignedClasses.trim().length < 1) return toast.info("No changes made")

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
        const jsonData = { id: staffInfo.id, requestData: staffInfo }

        const fn = async () => {
            try {
                const response = await fetch("/api/non-teaching-staff", {
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
                pending: "Updating non-teaching staff info...",
                success: "Non-teaching Staff info successfully updated",
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
        <div className="min-h-dvh h-auto overflow-auto">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border mb-4">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">Non-Teaching Staff ({allStaff.length})</h1>
                    <Button className="bg-brand cursor-pointer text-white" onPress={() => handleOpenModal("add")}>
                        <PlusCircle />
                        Add Non-Teaching Staff
                    </Button>
                </div>

                <StaffStatistics datatype="non-teaching-staff" statdata={staffStats} printdata={allStaff} className="" />

                <div className="mt-8">
                    <p className="mt-2 text-muted-foreground">All Staff ({allStaff.length})</p>
                </div>


                <ul className="mt-6 divide-y divide-border">
                    {!staffFetched ?
                        <div className="flex flex-row ">
                            <Spinner size="sm" className="text-center" />
                            <p className="mx-4">Fetching non-teaching staff data...</p>
                        </div>
                        :
                        allStaff.length < 1 ? <p className="mx-4">No non-teaching staff available</p> :
                            allStaff.map((item, index) => (
                                <li key={index} className="flex items-center gap-4 py-4">
                                    <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                        {item.surname.at(0) ?? "-"} {item.otherNames.at(0) ?? "-"}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate font-medium text-foreground">{item.surname} {item.otherNames}</p>
                                            {/* <span className="text-xs text-muted-foreground">{t.studentCount}</span> */}
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">Phone: {item.phone}</p>
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

            <Modal isOpen={isOpen} size="lg" backdrop="opaque" placement="center" onOpenChange={onOpenChange} className={`overflow-y-auto h-auto max-h-[50rem] mx-4 scrollbar-hide`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col bg-primary text-white">
                                {modalAction === "add" ?
                                    "Add New Non-Teaching Staff" : modalAction === "view" || modalAction === "update" ? "Non-Teaching Staff Info" : "Delete Non-Teaching Staff"}
                            </ModalHeader>

                            <ModalBody className="">
                                {modalAction === "add" || modalAction === "update" ?
                                    <>
                                        <p className="font-semibold">Personal Info</p>
                                        <div className="mx-4 gap-8 space-y-12 mb-4">
                                            <Input
                                                isRequired
                                                name="staffId"
                                                label="Staff Id"
                                                labelPlacement="outside"
                                                placeholder="IS000"
                                                className="w-full"
                                                value={staffInfo.staffId ?? ""}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <Input
                                                isRequired
                                                name="surname"
                                                label="Surname"
                                                labelPlacement="outside"
                                                placeholder="John"
                                                className="w-full"
                                                value={staffInfo.surname ?? ""}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <Input
                                                isRequired
                                                name="otherNames"
                                                label="Other Names"
                                                labelPlacement="outside"
                                                placeholder="Doe"
                                                className="w-full"
                                                value={staffInfo.otherNames ?? ""}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <Input
                                                name="placeOfBirth"
                                                isRequired
                                                label="Place of Birth"
                                                labelPlacement="outside"
                                                placeholder="Accra"
                                                className="w-full"
                                                value={staffInfo.placeOfBirth ?? ""}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <Input
                                                isRequired
                                                name="phone"
                                                label="Phone"
                                                labelPlacement="outside"
                                                placeholder="024XXXXXXXX"
                                                className="w-full"
                                                value={staffInfo.phone ?? ""}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <DatePicker
                                                label="Date of Birth"
                                                labelPlacement="outside"
                                                isRequired
                                                value={
                                                    staffInfo.dateOfBirth
                                                        ? new CalendarDate(
                                                            new Date(staffInfo.dateOfBirth).getFullYear(),
                                                            new Date(staffInfo.dateOfBirth).getMonth() + 1,
                                                            new Date(staffInfo.dateOfBirth).getDate()
                                                        ) as unknown as DateValue
                                                        : new CalendarDate(1996, 5, 15) as unknown as DateValue
                                                }
                                                placeholderValue={new CalendarDate(1996, 5, 15) as unknown as DateValue}
                                                onChange={(value) => setStaffInfo({ ...staffInfo, dateOfBirth: value ? value.toDate(getLocalTimeZone()) : new Date() })}
                                            />
                                            <Select
                                                name="nationality"
                                                isRequired
                                                label="Nationality"
                                                labelPlacement="outside"
                                                placeholder="Select nationality"
                                                selectedKeys={new Set(["gh"])}
                                                value={staffInfo.nationality ?? ""}
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
                                                selectedKeys={staffInfo.gender}
                                                value={staffInfo.gender ?? ""}
                                                onChange={handlePersonalInfoChange}
                                            >
                                                <SelectItem key="m">Male</SelectItem>
                                                <SelectItem key="f">Female</SelectItem>
                                            </Select>
                                            <Textarea
                                                name="jobDescription"
                                                className="w-full"
                                                label="Description"
                                                placeholder="Enter your description"
                                                labelPlacement="outside"
                                                onChange={handlePersonalInfoChange}
                                            />
                                        </div>
                                    </>
                                    :
                                    modalAction === "view" ?
                                        <Card className="w-full">
                                            <CardHeader className="flex gap-3">
                                                <UserRound className="border border rounded-lg" size={40} />
                                                <div className="flex flex-col">
                                                    <p className="text-md">{staffInfo.surname} {staffInfo.otherNames}</p>
                                                    <p className="text-small text-default-500">{staffInfo.gender === "m" ? "Male" : "Female"} | {staffInfo.phone}</p>
                                                </div>
                                            </CardHeader>
                                            <Divider />
                                            <CardBody className="gap-4">
                                                {/* <p >Staff Id: {staffInfo.staffId}</p> */}


                                                <Divider />

                                                <h1 className="font-bold">Personal</h1>
                                                <div className="mx-4">
                                                    <p className="text-default-500">Staff Id: <b>{staffInfo.staffId ?? "IS---"}</b></p>
                                                    <p className="text-default-500">Surname: <b>{staffInfo.surname}</b></p>
                                                    <p className="text-default-500">OtherNames: <b>{staffInfo.otherNames}</b></p>
                                                    <p className="text-default-500">Gender: <b>{staffInfo.gender === "m" ? "Male" : "Female"}</b></p>
                                                    <p className="text-default-500">Birth Place: <b>{staffInfo.placeOfBirth || "N/A"}</b></p>
                                                    <p className="text-default-500">UserType: <b>Non-Teaching Staff</b></p>
                                                </div>

                                                <h1 className="font-bold">Job Role</h1>
                                                <div className="mx-4">
                                                    <div className="flex flex-row justify-between">
                                                        <p className="text-small text-default-500">Job Role: <b>{staffInfo.jobDescription}</b> </p>
                                                    </div>
                                                </div>


                                                <Divider />
                                            </CardBody>
                                            <Divider />
                                        </Card>
                                        : modalAction === "delete" ?
                                            <Card className="w-full">
                                                <CardHeader className="flex gap-3">
                                                    <UserRound className="border border rounded-lg" size={40} />
                                                    <div className="flex flex-col">
                                                        <p className="text-md">{staffInfo.surname} {staffInfo.otherNames}</p>
                                                        <p className="text-small text-default-500">{staffInfo.gender} | {staffInfo.phone}</p>
                                                    </div>
                                                </CardHeader>
                                                <Divider />
                                                <CardBody className="gap-4">
                                                    <h1 className="">Are you sure you want to delete this non-teaching staff ?</h1>

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
