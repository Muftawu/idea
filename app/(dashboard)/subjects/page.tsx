"use client"
import { PlusCircle, EyeIcon, Edit, BookText, TrashIcon, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ClassSubjectGroupT, SubjectStatsSchemaT } from "@/lib/schemas"
import { Input, Select, SelectItem, Button, Alert } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Separator } from "@/components/ui/separator"
import { SubjecStatistics } from "@/components/dashboard/subject-stats"
import { BaseErrMsg, BaseRequestHeaders, capitalize, ClassGroups, DefaultSubjectScoreOptions, dynamicFormUpdates } from "@/lib/utils"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { Spinner } from "@heroui/react"
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";

export default function Subjects() {

    const router = useRouter()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState<boolean>(false)
    const [modalAction, setModalAction] = useState<"view" | "add" | "delete" | "update">("view")

    const [classSubjectGroupsFetched, setClassSubjectGroupsFetched] = useState<boolean>(false)
    const [classSubjectGroupInfo, setClassSubjectGroupInfo] = useState<ClassSubjectGroupT>({
        name: "",
        scoreType: "",
        subjects: [],
    })
    const [allClassSubjectGroups, setAllClassSubjectGroups] = useState<ClassSubjectGroupT[]>([])
    const [subjectCount, setSubjectCount] = useState<number>(0)

    const classGroupSubjectFormFieldRef = useRef<dynamicFormUpdates[]>([])
    const [classGroupAlreadyExists, setClassGroupAlreadyExists] = useState<boolean>(false)
    const [addToExistingSubjects, setAddToExistingSubjects] = useState<boolean>(false)

    const [subjectsToRemove, setSubjectsToRemove] = useState<string[]>([])
    const [subjectStats, setSubjectStats] = useState<SubjectStatsSchemaT>({subjectsCount: 0})

    useEffect(() => {
        const fetchAllClassGroupSubjects = async () => {
            try {
                const response = await fetch(`/api/class-subject-group?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    setClassSubjectGroupsFetched(false)
                } else {
                    setAllClassSubjectGroups(result.data)
                    setClassSubjectGroupsFetched(true)
                }
            } catch (err: any) {
            }
        }
        fetchAllClassGroupSubjects()
    }, [loading])

    useEffect(() => {
        const fetchSubjectStats = async () => {
            try {
                const response = await fetch(`/api/stats?query=subjects`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    setSubjectStats(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchSubjectStats()
    }, [loading])

    useEffect(() => {
        if (modalAction === "add") {
            if (allClassSubjectGroups.find(obj => obj.name === classSubjectGroupInfo.name)) {
                setClassGroupAlreadyExists(true)
            } else {
                setClassGroupAlreadyExists(false)
            }
        }

    }, [classSubjectGroupInfo.name])

    const handleOpenModal = (action: typeof modalAction, item?: ClassSubjectGroupT) => {
        if (!action) return

        if (action !== "add") {
            if (!item) return
            setClassSubjectGroupInfo({ ...item })
            if (item?.scoreType === "options") {
                setSubjectCount(item?.subjects?.length ?? 1)
            }
        }
        setModalAction(action)
        onOpen()
    }

    const handleOnCloseModal = () => {
        setClassSubjectGroupInfo({
            name: "",
            scoreType: "",
            subjects: [],
        })
        onClose()
        setSubjectCount(0)
        setAddToExistingSubjects(false)
        setSubjectsToRemove([])
    }

    const handleOnChangeClassGroupSubjectInfo = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name === "scoreType") {
            setSubjectCount(1)
        }
        if (modalAction === "add") {
            if (e.target.name === "name" && allClassSubjectGroups.find(obj => obj.name === e.target.value)) {
                setClassGroupAlreadyExists(true)
                return toast.info("Class subject group already exists")
            }
        }
        setClassSubjectGroupInfo({ ...classSubjectGroupInfo, [e.target.name]: e.target.value })
    }

    const onChangeDynamicClassSubjectFormFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let currentClassGroupFields = classGroupSubjectFormFieldRef.current
        if (modalAction === "add") {
            const fieldExists = currentClassGroupFields.find(obj => obj.field === e.target.name)
            if (fieldExists) {
                fieldExists.value = e.target.value
            } else {
                currentClassGroupFields.push({ field: e.target.name, value: e.target.value })
            }
        } else if (modalAction === "update") {
            if (addToExistingSubjects) {
                const fieldExists = currentClassGroupFields.find(obj => obj.field === e.target.name)
                if (fieldExists) {
                    fieldExists.value = e.target.value
                } else {
                    currentClassGroupFields.push({ field: e.target.name, value: e.target.value })
                }
            } else {
                setClassSubjectGroupInfo({ ...classSubjectGroupInfo, subjects: classSubjectGroupInfo.subjects?.map((item) => item.id === e.target.name ? { ...item, name: e.target.value } : item) })
            }
        }
    }

    const handleSaveNewClassSubjectGroup = async () => {
        if (classGroupAlreadyExists) {
            toast.info("Class group already exists")
            setClassGroupAlreadyExists(false)
            return
        }
        const data = classGroupSubjectFormFieldRef.current
        const subjects = data.map(({ value }) => (value))
        const payload = { classSubjectGroupInfo, subjects }

        handleOnCloseModal()
        const fn = async () => {
            try {
                const response = await fetch("/api/class-subject-group", {
                    method: "POST",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify(payload)
                })
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    return Promise.resolve(response.status)
                }
            } catch (err: any) {
            }
        }

        setLoading(true)
        await toast.promise(fn,
            {
                pending: "Adding new class group subjects",
                success: "Successfully added new class group subjects",
                error: BaseErrMsg
            })
        setLoading(false)
    }

    const handleUpdateClassSubjectGroup = async () => {
        if (classGroupAlreadyExists) {
            toast.info("Class group already exists")
            setClassGroupAlreadyExists(false)
            return
        }
        const { name, scoreType, ...editedChanges } = classSubjectGroupInfo
        const newlyAddedClasses = classGroupSubjectFormFieldRef.current
        const updateType = addToExistingSubjects ? "new" : "old"
        const payload = addToExistingSubjects ? newlyAddedClasses.map(({ value }) => value) : editedChanges

        const fn = async () => {
            try {
                const response = await fetch(`/api/class-subject-group?query=${classSubjectGroupInfo.id}`, {
                    method: "PATCH",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify({ updateType, payload })
                })
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    return Promise.resolve(response.status)
                }
            } catch (err: any) {
            }
        }

        handleOnCloseModal()
        setLoading(true)
        await toast.promise(fn,
            {
                pending: "Updating class group subject...",
                success: "Successfully updated class group subjects",
                error: BaseErrMsg
            })
        setLoading(false)
    }

    const handleOnClickAddNewSubjectButton = () => {
        if (modalAction === "add") {
            setSubjectCount(prev => prev + 1)
        } else if (modalAction === "update") {
            setAddToExistingSubjects(true)
            setSubjectCount(0)
            setClassSubjectGroupInfo({ ...classSubjectGroupInfo, subjects: [] })
        }
    }

    const handleOnSelectClassGroupSubjectsToRemove = (subjectId?: string) => {
        if (!subjectId) {
            console.log("subject id not found")
            return
        }
        setSubjectsToRemove(prev => prev.includes(subjectId) ? prev.filter(obj => obj !== subjectId) : [...prev, subjectId])
    }

    const handleDeleteClassSubjectGroup = async (deleteType: string) => {
        const fn = async () => {
            try {
                const response = await fetch(`/api/class-subject-group?query=${classSubjectGroupInfo.id}`, {
                    method: "DELETE",
                    headers: { ...BaseRequestHeaders },
                    body: JSON.stringify({ deleteType, subjectsToRemove })
                })
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    return Promise.resolve(response.status)
                }
            } catch (err: any) {
            }
        }

        handleOnCloseModal()
        setLoading(true)
        await toast.promise(fn,
            {
                pending: "Deletign class group subject...",
                success: "Successfully deleted class group subjects",
                error: BaseErrMsg
            })
        setLoading(false)
    }

    return (
        <div className="lg:h-dvh h-auto overflow-auto scrollbar-hide">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">Taught Subjects</h1>
                    <Button className="bg-brand cursor-pointer text-white" onPress={() => handleOpenModal("add")}>
                        <PlusCircle />
                        Add Subject
                    </Button>
                </div>

                <SubjecStatistics data={subjectStats} />

                <div className="mt-8">
                    <p className="mt-2 text-muted-foreground">All Class Group Subjects({allClassSubjectGroups.length})</p>
                </div>

                <ul className="mt-6 divide-y divide-border">
                    {!classSubjectGroupsFetched ?
                        <div className="flex flex-row ">
                            <Spinner size="sm" className="text-center" />
                            <p className="mx-4">Fetching class subject groups...</p>
                        </div>
                        :
                        allClassSubjectGroups.length < 1 ? <p>No class subject groups available</p> :
                            allClassSubjectGroups.map((item, index) => (
                                <li key={index} className="flex items-center gap-4 py-4">
                                    <div className="size-10 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-medium">
                                        {item.name.at(0)?.toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between">
                                            <p className="truncate font-medium text-foreground">{item.name.toUpperCase()}</p>
                                            {/* <span className="text-xs text-muted-foreground">{t.studentCount}</span> */}
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">Total: {item.subjects?.length}</p>
                                    </div>
                                    <div className="flex flex-row justify-center items-center">
                                        <Button size="sm" className="color-brand-100" color="primary" onPress={() => handleOpenModal("update", item)}>
                                            <Edit />
                                        </Button>
                                        <Button size="sm" className="color-brand-100 mx-2" color="primary" onPress={() => handleOpenModal("delete", item)}>
                                            <TrashIcon />
                                        </Button>
                                        <Button size="sm" className="color-brand-100" color="primary" onPress={() => handleOpenModal("view", item)}>
                                            <EyeIcon />
                                        </Button>

                                    </div>

                                    {/* <div className="flex flex row justify-center items-center"> */}
                                    {/*     <Button className="color-brand-100" color="primary" onPress={() => handleOpenModal("view", item)}> */}
                                    {/*         <Edit /> */}
                                    {/*         View */}
                                    {/*     </Button> */}
                                    {/*     <Button className="color-brand-100 mx-4" color="primary" onPress={() => handleOpenModal("update", item)}> */}
                                    {/*         <EyeIcon /> */}
                                    {/*         Edit */}
                                    {/*     </Button> */}
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
                                {modalAction === "add" ? "Add New Subject" : modalAction === "update" || modalAction === "view" ? `Class Group Info - ${classSubjectGroupInfo.name.toUpperCase()}` : `Delete Class Group Info - ${classSubjectGroupInfo.name.toUpperCase()}`}
                            </ModalHeader>
                            <Divider className="mb-2" />

                            <ModalBody className="">
                                {modalAction === "add" || modalAction === "update" ?
                                    <>
                                        <p className="font-semibold">Subject Info</p>
                                        <div className="mx-4 gap-4 space-y-8 mb-4">
                                            <div className="space-y-12">
                                                <Select
                                                    name="name"
                                                    isRequired
                                                    disabled={modalAction === "update" ? true : false}
                                                    label="Class Group"
                                                    labelPlacement="outside"
                                                    placeholder="Select class group"
                                                    selectedKeys={new Set([classSubjectGroupInfo.name])}
                                                    onChange={handleOnChangeClassGroupSubjectInfo}
                                                >
                                                    {ClassGroups.map((item, _) => (
                                                        <>
                                                            <SelectItem key={item.key}>{item.key.replace("_", " ").toUpperCase()}</SelectItem>
                                                        </>
                                                    ))}
                                                </Select>
                                                <Select
                                                    name="scoreType"
                                                    isRequired
                                                    disabled={modalAction === "update" ? true : false}
                                                    className="mt-4"
                                                    label="Scoring Type"
                                                    labelPlacement="outside"
                                                    placeholder="Select scoring type"
                                                    selectedKeys={new Set([classSubjectGroupInfo.scoreType])}
                                                    onChange={handleOnChangeClassGroupSubjectInfo}
                                                >
                                                    <SelectItem key="options">Options</SelectItem>
                                                    <SelectItem key="number">Number</SelectItem>
                                                </Select>
                                            </div>

                                            <Separator />

                                            <Alert color={modalAction === "add" ? "primary" : "primary"}>
                                                {modalAction === "add" ?
                                                    <div className="text-sm">
                                                        <p>Subjects added: {subjectCount}</p>
                                                        <p>Please complete the fields above to proceed</p>
                                                        {
                                                            classSubjectGroupInfo.scoreType === "options" ?
                                                                <p>Options: {DefaultSubjectScoreOptions.map((item) => `${item} | `)} </p>
                                                                : null}
                                                    </div>
                                                    :
                                                    <div className="text-sm">
                                                        {
                                                            addToExistingSubjects ?
                                                                modalAction === "update" ?
                                                                    <p>Add new subjects below</p> : <p>None</p>
                                                                :
                                                                <p>Available subjects ({classSubjectGroupInfo.subjects?.length})</p>
                                                        }
                                                    </div>
                                                }
                                            </Alert>

                                            {/* main option display area */}
                                            {classSubjectGroupInfo.scoreType !== null ?

                                                addToExistingSubjects ?
                                                    <>
                                                        {/* modalAction === "update" ? */}
                                                        {Array.from({ length: subjectCount }, (_, index) => (
                                                            <div className="flex flex-row justify-between items-center border shadow-md p-4 rounded-lg mb-4" key={index}>
                                                                <Input
                                                                    name={index.toString()}
                                                                    key={index}
                                                                    isRequired
                                                                    label={`Subject ${index + 1}`}
                                                                    labelPlacement="outside-top"
                                                                    placeholder="Enter Subject name"
                                                                    className="w-full"
                                                                    onChange={onChangeDynamicClassSubjectFormFieldChange}
                                                                />
                                                                <Button color="danger" className="cursor-pointer mx-2 mt-8" onPress={() => setSubjectCount(prev => prev - 1)}>Remove</Button>
                                                            </div>
                                                        ))}
                                                    </>
                                                    :
                                                    modalAction === "add" ?
                                                        Array.from({ length: subjectCount }, (_, index) => (
                                                            <div className="flex flex-row justify-between items-center border shadow-md p-4 rounded-lg mb-4" key={index}>
                                                                <Input
                                                                    name={index.toString()}
                                                                    key={index}
                                                                    isRequired
                                                                    label={`Subject ${index + 1}`}
                                                                    labelPlacement="outside-top"
                                                                    placeholder="Enter Subject name"
                                                                    className="w-full"
                                                                    onChange={onChangeDynamicClassSubjectFormFieldChange}
                                                                />
                                                                <Button color="danger" className="cursor-pointer mx-2 mt-8" onPress={() => setSubjectCount(prev => prev - 1)}>Remove</Button>
                                                            </div>
                                                        ))
                                                        :
                                                        classSubjectGroupInfo.subjects?.map((item, index) => (
                                                            <div className="flex flex-row justify-between items-center border shadow-md p-4 rounded-lg mb-4" key={index}>
                                                                <Input
                                                                    name={item.id}
                                                                    key={index}
                                                                    label="Edit subject name"
                                                                    labelPlacement="outside-top"
                                                                    placeholder="Enter Subject name"
                                                                    className="w-full"
                                                                    value={item.subjectName}
                                                                    onChange={onChangeDynamicClassSubjectFormFieldChange}
                                                                />
                                                                {/* <Button color="danger" className="cursor-pointer mx-2 mt-8" onPress={() => { removedSubjectsRef.current.push(item.id ?? "") }}>Delete</Button> */}
                                                            </div>
                                                        ))
                                                :
                                                <div>
                                                    <p>Number fields show up here</p>
                                                </div>
                                            }
                                            {addToExistingSubjects ? <Button className="cursor-pointer mt-4" onPress={() => setSubjectCount(prev => prev + 1)}>Add new subject</Button> :
                                                <Button className="cursor-pointer mt-4" onPress={() => handleOnClickAddNewSubjectButton()}>Add new subject</Button>
                                            }
                                            <Alert color="warning" title="Please save active changes before clicking on new subject" />
                                        </div>
                                    </>

                                    :

                                    modalAction === "view" ?
                                        <div>
                                            <div className="mb-4">
                                                <div className="flex flex-row justify-between items-center mb-4">
                                                    <h1 className="">Total: ({classSubjectGroupInfo.subjects?.length})</h1>
                                                    <h1 className="">Scoring Type: {classSubjectGroupInfo.scoreType}</h1>
                                                </div>
                                                <p><b>Score options</b>: {classSubjectGroupInfo.scoreType === "options" ? DefaultSubjectScoreOptions.map((item) => `${item} | `) : "Numeric value(%)"}</p>
                                            </div>

                                            <p className="mb-4">Subjects List</p>
                                            {classSubjectGroupInfo.subjects?.map((item, index) => (
                                                <Card key={item.id} className="w-full mb-4">
                                                    <CardHeader className="flex gap-3">
                                                        <BookText className="rounded-lg" color="gray" size={40} />
                                                        <div className="flex flex-col">
                                                            <p className="text-md">{index + 1}. {capitalize(item.subjectName)}</p>
                                                        </div>
                                                    </CardHeader>
                                                </Card>

                                            ))}
                                        </div>

                                        : modalAction === "delete" ?
                                            <Card className="w-full">
                                                <CardHeader className="flex gap-3">
                                                    <BookText className="rounded-lg" color="gray" size={40} />
                                                    <div className="flex flex-col">
                                                        <p className="text-md">{classSubjectGroupInfo.name.toUpperCase()}</p>
                                                    </div>
                                                </CardHeader>
                                                <Divider />
                                                <CardBody className="gap-4">
                                                    <h1 className="">Are you sure you want to delete this class subject?</h1>
                                                    <Alert color="primary" title="You can use the confirm delete all button to delete the entire class group or use the remove buttons to remove single subjects" />
                                                    <p>Subject List</p>

                                                    {classSubjectGroupInfo.subjects?.map((item, index) => (
                                                        <Card key={item.id} className="w-full mb-4">
                                                            <CardHeader className="flex gap-3">
                                                                <BookText className="rounded-lg" color="gray" size={40} />
                                                                <div className="flex flex-row justify-between items-center">
                                                                    <p className="text-sm">{index + 1}. {capitalize(item.subjectName)}</p>
                                                                </div>

                                                                <Button variant="solid" color={subjectsToRemove.includes(item.id ?? "") ? "primary" : "default"}
                                                                    onPress={() => handleOnSelectClassGroupSubjectsToRemove(item?.id)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </CardHeader>
                                                        </Card>

                                                    ))}

                                                    <Button className="color-brand-100" color="primary" onPress={() => handleDeleteClassSubjectGroup("selected")}>
                                                        Delete Selected ({subjectsToRemove.length})
                                                    </Button>

                                                    <Button className="color-brand-100" color="primary" onPress={() => handleDeleteClassSubjectGroup("all")}>
                                                        <Trash />
                                                        Delete All
                                                    </Button>

                                                </CardBody>
                                                <Divider />
                                            </Card>
                                            :
                                            null
                                }
                            </ModalBody>
                            {modalAction !== "delete" ?
                                <ModalFooter>
                                    <Button color="default" variant="flat" onPress={() => handleOnCloseModal()}>
                                        Close
                                    </Button>
                                    {modalAction === "add" ?
                                        <Button type="submit" color="primary" onPress={handleSaveNewClassSubjectGroup}>
                                            Submit
                                        </Button>
                                        :
                                        <Button type="submit" color="primary" onPress={handleUpdateClassSubjectGroup}>
                                            Save Changes
                                        </Button>

                                    }
                                </ModalFooter>
                                : null}
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    )
}
