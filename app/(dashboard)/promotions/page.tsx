"use client"
import { getLocalTimeZone, CalendarDate } from "@internationalized/date"
import { DateValue } from "@heroui/react";
import type React from "react"
import { Card, Alert, CardHeader, CardBody, CardFooter, Divider, Checkbox, CheckboxGroup } from "@heroui/react";
import { Input, Select, SelectItem, Button, DatePicker } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Settings2, BadgeInfoIcon, UserRound } from "lucide-react"
import { useRouter } from "next/navigation";
import { ClassRoomSchemaT, SchoolSettingsSchemaT, StudentSchemaT } from "@/lib/schemas";
import { BaseErrMsg, BaseRequestHeaders, dynamicFormUpdates } from "@/lib/utils";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";
import { useAuthContext } from "@/context/authContext";
import { useSchoolContext } from "@/context/schoolContext";

type dynamicSchema = {
    field: number,
    value?: string
}
export default function StudentPromotions() {

    const router = useRouter()
    const schoolSettings = useSchoolContext()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const allClassRef = useRef<ClassRoomSchemaT[]>([])
    const allStudentRef = useRef<StudentSchemaT[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isClassesLoaded, setIsClassesLoaded] = useState<boolean>(false)
    const [promoteAll, setPromoteAll] = useState<boolean>(false)

    const [promotionTo, setPromotionTo] = useState<string>("")
    const [promotionFrom, setPromotionFrom] = useState<string>("")
    const [filteredStudents, setFilteredStudents] = useState<StudentSchemaT[]>([])

    const [selectedStudents, setSelectedStudents] = useState<string[]>([])

    const userData = useAuthContext()
    const [modalAction, setModalAction] = useState<string>("edit")
    const [fetchedSchoolSettings, setFetchedSchoolSettings] = useState<boolean>(false)

    const classMapRef = useRef<dynamicSchema[]>([])

    useEffect(() => {
        const fetchAllClassrooms = async () => {
            try {
                const response = await fetch(`/api/classes?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    allClassRef.current = result.data
                    const mp = allClassRef.current.map((item, index) => ({ field: index, value: item.id }))
                    classMapRef.current = mp
                    setIsClassesLoaded(true)
                    setLoading(false)
                }
            } catch (err: any) {
                throw new Error(err)
            }
        }
        fetchAllClassrooms()
    }, [])

    useEffect(() => {
        const fetchAllStudents = async () => {
            try {
                const response = await fetch(`/api/students?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    allStudentRef.current = result.data
                }
            } catch (err: any) {
            }
        }
        fetchAllStudents()
    }, [])

    useEffect(() => {
        if (!isClassesLoaded) return
        if (classMapRef.current.length < 0) return

        const fn = () => {

            if (promotionFrom.trim().length > 1 && promotionTo.trim().length > 1) {

                const currentClassMap = classMapRef.current
                const fromId = currentClassMap.findIndex(obj => obj.value === promotionFrom)
                const toId = currentClassMap.findIndex(obj => obj.value === promotionTo)

                if (fromId === toId) {
                    return toast.info("Can't promote to the same class")
                }
                if (toId < fromId) {
                    return toast.info("Can't promote to a class lower than current")
                }

                setFilteredStudents(allStudentRef.current.filter(obj => obj.currentClass.id === promotionFrom))
            }
        }
        fn()
    }, [promotionFrom, promotionTo, isClassesLoaded])

    if (!userData) return null
    if (!schoolSettings?.schoolSettings) return null

    const handleStudentSelectionChange = (studentId: string[]) => {
        // setSelectedStudents(prev => prev.find(obj => obj) ? prev.filter(item => item !== studentId) : [...prev, studentId])
    }

    const handleStudentPromotions = async () => {

        if (!userData.userInfo.id) return null
        return toast.info("Promotions page under maintenance. Please try again later.")

        const payload = { promotionFrom, promotionTo, selectedStudents }

        const fn = async () => {
            try {
                const response = await fetch(`/api/student-promotions/`, {
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

        onClose()
        setLoading(true)
        await toast.promise(
            fn,
            {
                pending: "Applying student promotions. Please wait...",
                success: "Student promotions successfully applied.",
                error: BaseErrMsg,
            })
        router.refresh()
        setLoading(false)
    }

    const handleBatchSelection = () => {
        setSelectedStudents(prev => prev.length === filteredStudents.length ? [] : [...filteredStudents.map((obj) => obj.id ?? "")])
        { filteredStudents.length === selectedStudents.length ? setPromoteAll(false) : setPromoteAll(true) }
    }

    return (
        <div className="h-dvh">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">Student Promotions</h1>
                    <Button className="bg-brand cursor-pointer text-white" onPress={onOpen}>
                        <Settings2 /> Manage Promotions
                    </Button>
                </div>
                <p className="mt-2 text-muted-foreground">Manage all school promotions.</p>
                {loading ? <div className="flex flex-row justify-center items-center"><Spinner /> </div> :
                    <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
                        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button isIconOnly={true} color="primary">
                                        <BadgeInfoIcon />
                                    </Button>
                                    <div>
                                        <h1 className="text-lg font-bold">{schoolSettings.schoolSettings.currentTerm} Term</h1>
                                        <p className="font-normal text-foreground">Term</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button isIconOnly={true} color="primary">
                                        <BadgeInfoIcon />
                                    </Button>
                                    <div>
                                        <h1 className="text-lg font-bold">{schoolSettings.schoolSettings.academicYear}</h1>
                                        <p className="font-normal text-foreground">Academic Year</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                }
            </section>


            <Modal isOpen={isOpen} size="lg" backdrop="opaque" placement="center" onOpenChange={onOpenChange} className={`overflow-y-auto h-auto max-h-[80%] mx-4 scrollbar-hide`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col bg-primary text-white mb-4">
                                Manage Student Promotions
                            </ModalHeader>

                            <ModalBody className="flex">
                                <>
                                    <p className="font-semibold">Apply filter</p>
                                    <div className="flex flex-col mx-4 gap-4 space-y-4 mb-4">
                                        <div className="flex flex-row">
                                            <Select
                                                label="Promotion from"
                                                className="mx-2"
                                                labelPlacement="outside"
                                                placeholder="Select class to promote from"
                                                onChange={(e) => setPromotionFrom(e.target.value)}
                                            >
                                                {allClassRef.current.map((item) => (
                                                    <SelectItem key={item.id} textValue={`${item.name}`}>{item.name}</SelectItem>
                                                ))}
                                            </Select>
                                            <Select
                                                label="Promotion to"
                                                className="mx-2"
                                                labelPlacement="outside"
                                                placeholder="Select class to promote to"
                                                onChange={(e) => setPromotionTo(e.target.value)}
                                            >
                                                {allClassRef.current.map((item) => (
                                                    <SelectItem key={item.id} textValue={`${item.name}`}>{item.name}</SelectItem>
                                                ))}
                                            </Select>

                                        </div>


                                        <Alert color="default" className="flex flex-row" endContent={
                                            <Button color="primary" onPress={() => handleBatchSelection()}>
                                                {promoteAll ? "Unselect All" : "Select All"}
                                            </Button>

                                        }>
                                            <div>
                                                <h1>Available Students</h1>
                                            </div>
                                        </Alert>

                                        {promotionFrom.trim().length > 1 && promotionTo.trim().length > 1 ?
                                            <div className="flex flex-col gap-3 mx-4">
                                                <CheckboxGroup
                                                    color="primary"
                                                    label="Select students to promote"
                                                    value={selectedStudents}
                                                    onValueChange={setSelectedStudents}
                                                >
                                                    {filteredStudents.map((item) => (
                                                        <Alert key={item.id} hideIcon hideIconWrapper>
                                                            <Checkbox className="" value={item.id}>
                                                                {item.surname} {item.otherNames}
                                                            </Checkbox>
                                                        </Alert>
                                                    ))}
                                                </CheckboxGroup>
                                            </div>
                                            :
                                            null}
                                    </div>
                                </>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="default" variant="flat" onPress={() => onClose()}>
                                    Close
                                </Button>
                                <Button disabled={promotionFrom.trim().length < 1 && promotionTo.trim().length < 1 && filteredStudents.length < 1} onPress={handleStudentPromotions} type="submit" color="primary">
                                    Apply promotions
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal >
        </div >
    )
}
