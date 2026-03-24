"use client"
import { getLocalTimeZone, CalendarDate } from "@internationalized/date"
import { DateValue } from "@heroui/react";
import type React from "react"
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { Input, Select, SelectItem, Button, DatePicker } from "@heroui/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Settings2, BadgeInfoIcon } from "lucide-react"
import { useRouter } from "next/navigation";
import { SchoolSettingsSchemaT } from "@/lib/schemas";
import { BaseErrMsg, BaseRequestHeaders } from "@/lib/utils";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/react";
import { useAuthContext } from "@/context/authContext";

export default function Settings() {

    const router = useRouter()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const userData = useAuthContext()
    const [modalAction, setModalAction] = useState<string>("edit")
    const [loading, setLoading] = useState<boolean>(false)
    const [fetchedSchoolSettings, setFetchedSchoolSettings] = useState<boolean>(false)
    const [schoolSettings, setSchoolSettings] = useState<SchoolSettingsSchemaT>({
        name: "",
        currentTerm: "",
        nextReopeningDate: new Date(),
        termStarts: new Date(),
        termEnds: new Date(),
    })

    useEffect(() => {
        const fetchSchoolSettings = async () => {
            try {
                const response = await fetch(`/api/stats?query=main&admin_id=${userData?.userInfo.id}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return null
                } else {
                    setSchoolSettings(result.data)
                }
                setFetchedSchoolSettings(true)
            } catch (err: any) {
                setFetchedSchoolSettings(true)
            }
        }
        fetchSchoolSettings()
    }, [loading, userData?.userInfo.id])

    if (!userData) return null

    const handleOnSchoolSettingsFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (e.target.name.startsWith("term")) {
            setSchoolSettings({ ...schoolSettings, [e.target.name]: new Date(e.target.value).toISOString().split("T")[0] })
        } else {
            setSchoolSettings({ ...schoolSettings, [e.target.name]: e.target.value })
        }
    }

    const handleUpdateSchoolSettings = async () => {
        if (!userData.userInfo.id) return null
        const payload = {
            currentTerm: schoolSettings.currentTerm,
            termStarts: new Date(schoolSettings.termStarts).toISOString().split("T")[0],
            termEnds: new Date(schoolSettings.termEnds).toISOString().split("T")[0],
            nextReopeningDate: new Date(schoolSettings.nextReopeningDate).toISOString().split("T")[0]
        }
        const fn = async () => {
            try {
                const response = await fetch(`/api/stats?query=main&admin_id=${userData?.userInfo.id}`, {
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
                pending: "Saving student record",
                success: "Student record successfully saved",
                error: BaseErrMsg,
            })
        router.refresh()
        setLoading(false)
    }

    return (
        <div className="h-dvh">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">Taught Subjects</h1>
                    <Button className="bg-brand cursor-pointer text-white" onPress={onOpen}>
                        <Settings2 /> Update Settings
                    </Button>
                </div>
                <p className="mt-2 text-muted-foreground">Make school changes and setting here.</p>
                {!fetchedSchoolSettings ? <div className="flex flex-row justify-center items-center"><Spinner /> </div> :
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Button isIconOnly={true} color="primary">
                                        <BadgeInfoIcon />
                                    </Button>
                                    <div>
                                        <h1 className="text-lg font-bold">{schoolSettings.currentTerm} Term</h1>
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
                                        <h1 className="text-lg font-bold">{new Date(schoolSettings.termStarts).toDateString()}</h1>
                                        <p className="font-normal text-foreground">Term Start</p>
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
                                        <h1 className="text-lg font-bold">{new Date(schoolSettings.termEnds).toDateString()}</h1>
                                        <p className="font-normal text-foreground">Term Start</p>
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
                                        <h1 className="text-lg font-bold">{new Date(schoolSettings.nextReopeningDate).toDateString()}</h1>
                                        <p className="font-normal text-foreground">Next Reopening Date</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </section>


            <Modal isOpen={isOpen} size="lg" backdrop="opaque" placement="center" onOpenChange={onOpenChange} className={`overflow-y-auto h-auto max-h-[50rem] mx-4`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col bg-primary text-white mb-4">
                                Edit School Settings
                            </ModalHeader>

                            <ModalBody className="">
                                <>
                                    <p className="font-semibold">School Info</p>
                                    <div className="mx-4 gap-4 space-y-8 mb-4">
                                        <Select
                                            name="currentTerm"
                                            label="Current Term"
                                            labelPlacement="outside"
                                            placeholder="Select current term"
                                            selectedKeys={new Set([schoolSettings.currentTerm])}
                                            onChange={handleOnSchoolSettingsFormChange}
                                        >
                                            <SelectItem key="1st">1st Term</SelectItem>
                                            <SelectItem key="2nd">2nd Term</SelectItem>
                                            <SelectItem key="3rd">3rd Term</SelectItem>
                                        </Select>
                                        <DatePicker
                                            label="Term start date (month/day/year)"
                                            labelPlacement="outside"
                                            showMonthAndYearPickers
                                            className=""
                                            value={
                                                schoolSettings.termStarts
                                                    ? new CalendarDate(
                                                        new Date(schoolSettings.termStarts).getFullYear(),
                                                        new Date(schoolSettings.termStarts).getMonth() + 1,
                                                        new Date(schoolSettings.termStarts).getDate()
                                                    ) as unknown as DateValue
                                                    : new CalendarDate(2026, 3, 17) as unknown as DateValue
                                            }
                                            placeholderValue={new CalendarDate(2026, 3, 17) as unknown as DateValue}
                                            onChange={(value) => setSchoolSettings({
                                                ...schoolSettings,
                                                termStarts: value ? value.toDate(getLocalTimeZone()) : new Date()
                                            })}
                                        />
                                        <DatePicker
                                            label="Term Ends / Vacation Date (month/day/year)"
                                            labelPlacement="outside"
                                            showMonthAndYearPickers
                                            className=""
                                            value={
                                                schoolSettings.termEnds
                                                    ? new CalendarDate(
                                                        new Date(schoolSettings.termEnds).getFullYear(),
                                                        new Date(schoolSettings.termEnds).getMonth() + 1,
                                                        new Date(schoolSettings.termEnds).getDate()
                                                    ) as unknown as DateValue
                                                    : new CalendarDate(2026, 3, 17) as unknown as DateValue
                                            }
                                            placeholderValue={new CalendarDate(2026, 3, 17) as unknown as DateValue}
                                            onChange={(value) => setSchoolSettings({
                                                ...schoolSettings,
                                                termEnds: value ? value.toDate(getLocalTimeZone()) : new Date()
                                            })}
                                        />
                                        <DatePicker
                                            label="Next Reopening date (month/day/year)"
                                            labelPlacement="outside"
                                            showMonthAndYearPickers
                                            className=""
                                            value={
                                                schoolSettings.nextReopeningDate
                                                    ? new CalendarDate(
                                                        new Date(schoolSettings.nextReopeningDate).getFullYear(),
                                                        new Date(schoolSettings.nextReopeningDate).getMonth() + 1,
                                                        new Date(schoolSettings.nextReopeningDate).getDate()
                                                    ) as unknown as DateValue
                                                    : new CalendarDate(2026, 3, 17) as unknown as DateValue
                                            }
                                            placeholderValue={new CalendarDate(2026, 3, 17) as unknown as DateValue}
                                            onChange={(value) => setSchoolSettings({
                                                ...schoolSettings,
                                                nextReopeningDate: value ? value.toDate(getLocalTimeZone()) : new Date()
                                            })}
                                        />

                                    </div>
                                </>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="default" variant="flat" onPress={() => onClose()}>
                                    Close
                                </Button>
                                <Button onPress={handleUpdateSchoolSettings} type="submit" color="primary">
                                    Save Changes
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}
