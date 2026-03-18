"use client"
import { PlusCircle, EyeIcon, UserRound, TrashIcon, Edit, CircleUser } from "lucide-react"
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect, useRef } from "react"
import { ClassRoomSchemaT } from "@/lib/schemas"
import { Form, Input, Select, SelectItem, Checkbox, Button, Alert } from "@heroui/react";
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { BaseErrMsg, BaseRequestHeaders, capitalize, ClassGroups } from "@/lib/utils"
import { toast } from "react-toastify"
import { Spinner } from "@heroui/react"
import { StaffT } from "@/lib/schemas"
import { dynamicFormUpdates } from "@/lib/utils"

export default function Classrooms() {

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [allClassrooms, setAllClassrooms] = useState<ClassRoomSchemaT[]>([])
    const [classroomsFetched, setClassroomsFetched] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [availableStaff, setAvailableStaff] = useState<StaffT[]>([])
    const classroomInfoUpdates = useRef<dynamicFormUpdates[]>([])

    const [modalAction, setModalAction] = useState<"view" | "add" | "delete" | "update">("view")

    const [classRoomInfo, setClassRoomInfo] = useState<ClassRoomSchemaT>({
        name: "",
        classTeacher: "",
        classGroup: "",
        studentCount: 0,
        studentList: []
    })

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
                setClassroomsFetched(true)
            } catch (err: any) {
                throw new Error(err)
            }
        }
        fetchAllClassrooms()
    }, [loading])

    useEffect(() => {
        const fetchAllStaff = async () => {
            try {
                const response = await fetch(`/api/staff?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    setAvailableStaff(result.data)
                }

            } catch (err: any) {
            }
        }
        { modalAction === "add" || modalAction === "update" ? fetchAllStaff() : null }
    }, [modalAction])


    const handleOpenModal = (action: typeof modalAction, item?: ClassRoomSchemaT) => {
        if (!action) return
        setModalAction(action)
        { item ? setClassRoomInfo(item) : null }
        onOpen()
    }

    const handleOnCloseModal = () => {
        setClassRoomInfo({
            name: "",
            classTeacher: "",
            classGroup: "",
        })
        onClose()
    }

    const handleClassroomValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const val = e.target.value
        if (modalAction === "update") {
            const updates = classroomInfoUpdates.current
            const fieldExists = updates.find(obj => obj.field === e.target.name)
            if (fieldExists) {
                fieldExists.value = val
            } else {
                classroomInfoUpdates.current.push({ field: e.target.name, value: val })
            }
        }
        setClassRoomInfo({ ...classRoomInfo, [e.target.name]: val })
    }

    async function handleCreateNewStaff() {
        onClose()
        if (!classRoomInfo.classGroup) return toast.info("No class group selected. Please select a class group.")
        const classExists = allClassrooms.find(obj => obj.name === classRoomInfo.name)
        if (classExists) return toast.info("Class already exists")
        const fn = async () => {
            try {
                const response = await fetch("/api/classes", {
                    method: "POST",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify(classRoomInfo)
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
                pending: "Creating classroom...",
                success: "Classroom successfully created",
                error: BaseErrMsg
            }
        )
        handleOnCloseModal()
        setLoading(false)
    }

    async function handleDelete() {
        onClose()
        const fn = async () => {
            try {
                const response = await fetch(`/api/classes?query=${classRoomInfo.id}`, {
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
                pending: "Deleting class...",
                success: "Staff successfully deleted",
                error: BaseErrMsg
            }
        )
        setLoading(false)
    }

    const handleUpdateClassInfo = async () => {
        onClose()
        if (classroomInfoUpdates.current.length < 1) return toast.info("No changes made")

        const payload = classroomInfoUpdates.current.map(({ field, value }) => ({ [field]: value }))

        let data = {}
        for (var item in payload) {
            const [[k, v]] = Object.entries(payload[item])
            data = { ...data, [k]: v }
        }
        const jsonData = { id: classRoomInfo.id, ...data }

        const fn = async () => {
            try {
                const response = await fetch("/api/classes", {
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
                pending: "Updating class info...",
                success: "Class info successfully updated",
                error: BaseErrMsg
            }
        )
        handleOnCloseModal()
        setLoading(false)
        classroomInfoUpdates.current = []
    }

    return (
        <>
            <div className="lg:h-dvh h-auto overflow-auto mb-4 scrollbar-hide">
                <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-balance text-2xl font-semibold text-foreground">Classes ({allClassrooms.length})</h1>
                        <Button className="bg-brand cursor-pointer text-white" onClick={() => handleOpenModal("add")}>
                            <PlusCircle />
                            Create Class
                        </Button>
                    </div>

                    {!classroomsFetched || allClassrooms.length < 1 ? <p>No class data available for chart display</p> :
                        <div className="mt-6 mb-4 h-80 w-full rounded-xl bg-background p-4 ring-1 ring-border">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={allClassrooms} barCategoryGap={18}>
                                    <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                                    <YAxis stroke="hsl(var(--muted-foreground))" />
                                    <Tooltip
                                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                                        labelStyle={{ color: "hsl(var(--foreground))" }}
                                    />
                                    <Legend />
                                    <Bar dataKey="studentCount" fill="#ff9001" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    }

                    <div className="mt-8">
                        <p className="mt-2 text-muted-foreground">List of all Classes ({allClassrooms.length})</p>
                    </div>

                    <ul className="mt-6 divide-y divide-border">
                        {!classroomsFetched ?
                            <div className="flex flex-row ">
                                <Spinner size="sm" className="text-center" />
                                <p className="mx-4">Fetching classrooms...</p>
                            </div>
                            :
                            allClassrooms.length === 0 ? <p className="mx-4">No classrooms available</p> :
                                allClassrooms.map((item, index) => (
                                    <li key={index} className="flex items-center gap-4 py-4">
                                        <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                            {item.name[0]}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="truncate font-medium text-foreground">{item.name}</p>
                                                {/* <span className="text-xs text-muted-foreground">{t.studentCount}</span> */}
                                            </div>
                                            <p className="truncate text-sm text-muted-foreground">Group: {item.classGroup?.toUpperCase()} | Class size: {item.studentCount}</p>
                                            {/* <p className="truncate text-sm text-muted-foreground">ClassTeacher: {item.classTeacherName}</p> */}
                                        </div>
                                        <div className="flex flex-row justify-center items-center mx-8">
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
                    </ul>
                </section>
            </div>

            <Modal isOpen={isOpen} size="lg" backdrop="opaque" placement="center" onOpenChange={onOpenChange} className={`overflow-y-auto h-auto max-h-[50rem] mx-4 scrollbar-hide`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col bg-primary text-white mb-4">
                                {modalAction === "add" ?
                                    "Create New Class" : modalAction === "view" ? "Class Info" : "Delete Class"}
                            </ModalHeader>

                            <ModalBody> {modalAction === "add" || modalAction === "update" ?
                                <>
                                    <p className="font-semibold">Class Info</p>
                                    <div className="mx-4 gap-8 space-y-12 mb-4">
                                        <Input
                                            isRequired={true}
                                            label="Name"
                                            name="name"
                                            labelPlacement="outside"
                                            placeholder="Class name"
                                            className="w-full"
                                            value={classRoomInfo.name}
                                            onChange={handleClassroomValueChange}
                                        />
                                        <Select
                                            isRequired={true}
                                            label="Group (This field is required)"
                                            labelPlacement="outside"
                                            name="classGroup"
                                            placeholder="Select class group"
                                            selectedKeys={new Set([classRoomInfo.classGroup ?? ""])}
                                            value={classRoomInfo.classGroup}
                                            onChange={handleClassroomValueChange}
                                            className=""
                                        >
                                            {ClassGroups.map((item) => (
                                                <SelectItem key={item.key} textValue={`${capitalize(item.key.replace("_", " "))}`}>{capitalize(item.value).replace("_", " ")} Group</SelectItem>
                                            ))}
                                        </Select>
                                        <Select
                                            label="Class Teacher (optional)"
                                            labelPlacement="outside"
                                            name="classTeacher"
                                            placeholder="Select class teacher"
                                            selectedKeys={new Set([classRoomInfo.classTeacher ?? ""])}
                                            value={classRoomInfo.classTeacher}
                                            onChange={handleClassroomValueChange}
                                            className=""
                                        >
                                            {availableStaff.map((item) => (
                                                <SelectItem key={item.id} textValue={`${item.personalInfo.first_name} ${item.personalInfo.last_name}`}>{item.personalInfo.first_name} {item.personalInfo.last_name}</SelectItem>
                                            ))}
                                        </Select>
                                    </div>
                                </>
                                :
                                modalAction === "view" ?
                                    <>
                                        <Alert color="primary">
                                            <div className="flex flex-col">
                                                <p className="text-md">{classRoomInfo.name}</p>
                                                <p className="text-small text-default-500">{classRoomInfo.classGroup} | Class size: {classRoomInfo.studentCount}</p>
                                            </div>
                                        </Alert>

                                        <p className="mt-4">Student List ({classRoomInfo?.studentList?.length ?? 0})</p>
                                        <Divider />
                                        {!classRoomInfo?.studentList ? null :
                                            classRoomInfo.studentList?.length < 1 ? <p>No students available</p> :
                                                classRoomInfo?.studentList?.map((item, index) => (
                                                    <Card className="w-full">
                                                        <CardHeader className="flex gap-3">
                                                            <CircleUser className="border border rounded-lg" size={40} />
                                                            <p>{index + 1}. {item.student__surname} {item.student__otherNames}</p>
                                                            <p>{item.student__gender === "m" ? "Male" : "Female"}</p>
                                                        </CardHeader>
                                                        <Divider />
                                                    </Card>

                                                ))}
                                    </>
                                    : modalAction === "delete" ?
                                        <Card className="w-full">
                                            <CardHeader className="flex gap-3">
                                                <UserRound className="border border rounded-lg" size={40} />
                                                <div className="flex flex-col">
                                                    <p className="text-md">Class: {classRoomInfo.name}</p>
                                                    <p className="text-small text-default-500">Group: {classRoomInfo.classGroup?.toUpperCase()} GROUP</p>
                                                </div>
                                            </CardHeader>
                                            <Divider />
                                            <CardBody className="gap-4">

                                                <h1 className="">Are you sure you want to delete this class?</h1>

                                                <Button className="color-brand-100" color="primary" onPress={() => handleDelete()}>
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
                                        <Button type="submit" color="primary" onPress={handleUpdateClassInfo}>
                                            Save Changes
                                        </Button>
                                        : null
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </>


    )
}
