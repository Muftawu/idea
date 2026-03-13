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
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Laptop, Thermometer, Lightbulb, Refrigerator, Settings2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { SchoolSettingsSchemaT } from "@/lib/schemas";

type SettingsInfoProp = {
    id: number
    title: string
    description: string
    value: string
    icon: React.ComponentType<{ className?: string }>
}

const settingsInfo: SettingsInfoProp[] = [
    { id: 1, title: "Current Term", description: "Current academic term", value: "1st", icon: Lightbulb },
    { id: 2, title: "Term Duration", description: "Number of days in terms", value: "55", icon: Lightbulb },
    { id: 3, title: "Term Start", description: "When did term begin", value: new Date().toLocaleDateString(), icon: Lightbulb },
    { id: 3, title: "Term End", description: "When is the next vacation", value: new Date().toLocaleDateString(), icon: Lightbulb },
]

export default function Settings() {

    const router = useRouter()
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const [modalAction, setModalAction] = useState<string>("edit")
    const [loading, setLoading] = useState<boolean>(false)
    const [schoolSettings, setSchoolSettings] = useState<SchoolSettingsSchemaT>({
        currentTerm: "",
        termDuration: "",
        termStart: new Date(),
        termEnd: new Date(),

    })

    const handleOnSchoolSettingsFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setSchoolSettings({ ...schoolSettings, [e.target.name]: e.target.value })
    }

    const handleUpdatedSchoolSettings = async () => {
    }

    return (
        <div className="h-dvh">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="text-balance text-2xl font-semibold text-foreground">School Settings</h1>
                    <Button onPress={onOpen} color="primary" isIconOnly={true}>
                        <Settings2 />
                    </Button>
                </div>
                <p className="mt-2 text-muted-foreground">Make school changes and setting here.</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {settingsInfo.map((item, index) => (
                        <div key={index} className="rounded-xl bg-background p-4 ring-1 ring-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <item.icon className={`size-5 text-primary`} />
                                    <div>
                                        <p className="font-medium text-foreground">{item.title}</p>
                                        <p className="text-xs text-muted-foreground">{item.description}</p>
                                    </div>
                                </div>
                                <h1 className="text-lg font-bold">{item.value}</h1>
                            </div>
                        </div>
                    ))}
                </div>
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
                                    <div className="mx-4 gap-8 space-y-12 mb-4">
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
                                            label="Term start date"
                                            labelPlacement="outside"
                                            showMonthAndYearPickers
                                            className=""
                                            value={
                                                schoolSettings.termStart
                                                    ? new CalendarDate(
                                                        new Date(schoolSettings.termStart).getFullYear(),
                                                        new Date(schoolSettings.termStart).getMonth() + 1,
                                                        new Date(schoolSettings.termStart).getDate()
                                                    ) as unknown as DateValue
                                                    : new CalendarDate(2005, 5, 15) as unknown as DateValue
                                            }
                                            placeholderValue={new CalendarDate(2005, 5, 15) as unknown as DateValue}
                                            onChange={(value) => setSchoolSettings({
                                                ...schoolSettings,
                                                termStart: value ? value.toDate(getLocalTimeZone()) : new Date()
                                            })}
                                        />

                                        <DatePicker
                                            label="Term Ends"
                                            labelPlacement="outside"
                                            showMonthAndYearPickers
                                            className=""
                                            value={
                                                schoolSettings.termEnd
                                                    ? new CalendarDate(
                                                        new Date(schoolSettings.termEnd).getFullYear(),
                                                        new Date(schoolSettings.termEnd).getMonth() + 1,
                                                        new Date(schoolSettings.termEnd).getDate()
                                                    ) as unknown as DateValue
                                                    : new CalendarDate(2005, 5, 15) as unknown as DateValue
                                            }
                                            placeholderValue={new CalendarDate(2005, 5, 15) as unknown as DateValue}
                                            onChange={(value) => setSchoolSettings({
                                                ...schoolSettings,
                                                termEnd: value ? value.toDate(getLocalTimeZone()) : new Date()
                                            })}
                                        />
                                    </div>
                                </>
                            </ModalBody>

                            <ModalFooter>
                                <Button color="default" variant="flat" onPress={() => onClose()}>
                                    Close
                                </Button>
                                <Button onPress={handleUpdatedSchoolSettings} type="submit" color="primary">
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
