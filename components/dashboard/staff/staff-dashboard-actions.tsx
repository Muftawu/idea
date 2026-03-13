"use client"

import { useContext, useEffect, useState } from "react"
import { ToggleSwitch } from "@/components/ui/toggle-switch"
import { BaseRequestHeaders } from "@/lib/utils"
import { AuthContext } from "@/context/authContext"
import { Card, CardHeader, CardBody, CardFooter, Divider } from "@heroui/react";
import { PlusCircle, EyeIcon, Edit, TrashIcon, UserRound } from "lucide-react"
import { ClassRoomSchemaT, GuardianSchemaT, StudentSchemaT, StudentStatsSchemaT } from "@/lib/schemas"
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

export const StaffDashboardActions = () => {

    const userData = useContext(AuthContext)
    if (!userData) return (
        <div className="flex flex-row">
            <Spinner label="Loading info. Please wait..." />
            <p>Loading info. Please wait...</p>
        </div>
    )

    const [handledClassesFetched, setHandldClassesFetched] = useState<boolean>(false)
    const [handledClasses, setHandledClasses] = useState<ClassRoomSchemaT[]>([])

    useEffect(() => {
        const fetchHandledClasses = async () => {
            try {
                const response = await fetch(`/api/staff?query=${userData.userInfo.id}`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
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
        fetchHandledClasses()
    }, [])


    const handleOnOpenModal = (action: string) => {
        if (!action) return
        open
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
                                        <div className="mx-4 gap-8 space-y-12 mb-4">
                                            <Input
                                                isRequired
                                                name="surname"
                                                label="Surname"
                                                labelPlacement="outside"
                                                placeholder="John"
                                                className="w-full"
                                                value={studentInfo.surname}
                                                onChange={handleStudentInfoChange}
                                            />
                                            <Input
                                                isRequired
                                                name="otherNames"
                                                label="Other names"
                                                labelPlacement="outside"
                                                placeholder="Doe"
                                                className="w-full"
                                                value={studentInfo.otherNames}
                                                onChange={handleStudentInfoChange}
                                            />
                                            <Input
                                                name="placeOfBirth"
                                                label="Place of Birth"
                                                labelPlacement="outside"
                                                placeholder="Kumasi"
                                                className="w-full"
                                                value={studentInfo.placeOfBirth}
                                                onChange={handleStudentInfoChange}
                                            />
                                            <DatePicker
                                                name="dateOfBirth"
                                                label="Date of Birth"
                                                labelPlacement="outside"
                                                showMonthAndYearPickers
                                                className=""
                                                value={
                                                    studentInfo.dateOfBirth
                                                        ? new CalendarDate(
                                                            new Date(studentInfo.dateOfBirth).getFullYear(),
                                                            new Date(studentInfo.dateOfBirth).getMonth() + 1,
                                                            new Date(studentInfo.dateOfBirth).getDate()
                                                        ) as unknown as DateValue
                                                        : new CalendarDate(2005, 5, 15) as unknown as DateValue
                                                }
                                                placeholderValue={new CalendarDate(2005, 5, 15) as unknown as DateValue}
                                                onChange={(value) => setStudentInfo({
                                                    ...studentInfo,
                                                    dateOfBirth: value ? value.toDate(getLocalTimeZone()) : new Date()
                                                })}
                                            />
                                            <Select
                                                name="nationality"
                                                isRequired
                                                label="Nationality"
                                                labelPlacement="outside"
                                                placeholder="Select nationality"
                                                selectedKeys={new Set(["Ghanaian"])}
                                                value={studentInfo.nationality}
                                                defaultSelectedKeys={[studentInfo.nationality]}
                                                onChange={handleStudentInfoChange}
                                            >
                                                {Nationalities.map((item) => (
                                                    <SelectItem key={item}>{item}</SelectItem>
                                                ))}
                                            </Select>
                                            <Select
                                                name="gender"
                                                isRequired
                                                label="Gender"
                                                labelPlacement="outside"
                                                placeholder="Select gender"
                                                value={studentInfo.gender}
                                                onChange={handleStudentInfoChange}
                                            >
                                                <SelectItem key="Male">Male</SelectItem>
                                                <SelectItem key="Female">Female</SelectItem>
                                            </Select>
                                            <Select
                                                name="religion"
                                                label="Religion"
                                                labelPlacement="outside"
                                                placeholder="Select religion"
                                                defaultSelectedKeys={[studentInfo.religion]}
                                                value={studentInfo.religion}
                                                onChange={handleStudentInfoChange}
                                            >
                                                <SelectItem key="Christian">Christian</SelectItem>
                                                <SelectItem key="Muslim">Muslim</SelectItem>
                                                <SelectItem key="Other">Other</SelectItem>
                                            </Select>
                                            <Input
                                                name="schoolsAttended"
                                                label="Previous School"
                                                labelPlacement="outside"
                                                placeholder="Name of previous school if applicable"
                                                className="w-full"
                                                value={studentInfo.schoolsAttended ?? ""}
                                                onChange={handleStudentInfoChange}
                                            />
                                            <Input
                                                name="healthProblems"
                                                label="Health Issues"
                                                labelPlacement="outside"
                                                placeholder="Concerning health related issues"
                                                className="w-full"
                                                value={studentInfo.healthProblems ?? ""}
                                                onChange={handleStudentInfoChange}
                                            />
                                        </div>
                                        <Separator />
                                        <p className="font-semibold">Student Assigned Class</p>
                                        <div className="mx-4 gap-8 space-y-12">
                                            <Select
                                                name="currentClass"
                                                isRequired
                                                label="Student Class"
                                                labelPlacement="outside"
                                                placeholder="Select student class"
                                                selectedKeys={[studentInfo.currentClass?.id ?? ""]}
                                                value={studentInfo.currentClass.id}
                                                onChange={handleStudentInfoChange}
                                            >
                                                {availabelClasses.map((item) => (
                                                    <SelectItem key={item.id} textValue={`${item.name} ${item.subclassLabel ?? ""}`}>{item.name} {item.subclassLabel ?? ""}</SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <Separator />
                                        <p className="font-semibold">Guardian Info</p>
                                        <div className="mx-4 gap-8 space-y-12">
                                            <Input
                                                name="fullname"
                                                isRequired={true}
                                                label="Guardian Name"
                                                labelPlacement="outside"
                                                placeholder=""
                                                className="w-full"
                                                value={guardianInfo.fullname}
                                                onChange={handleGuardianInfoChange}
                                            />
                                            <Input
                                                name="occupation"
                                                label="Occupation"
                                                labelPlacement="outside"
                                                placeholder="Trader"
                                                className="w-full"
                                                value={guardianInfo.occupation}
                                                onChange={handleGuardianInfoChange}
                                            />
                                            <Select
                                                name="educationalBackground"
                                                label="Educational Background"
                                                labelPlacement="outside"
                                                placeholder={modalAction === "update" ? guardianInfo.educationalBackground : "Select edu. background"}
                                                value={guardianInfo.educationalBackground}
                                                onChange={handleGuardianInfoChange}
                                            >
                                                {EducationalBackgrounds.map((item) => (
                                                    <SelectItem key={item} textValue={`${item}`}>{item}</SelectItem>
                                                ))}
                                            </Select>
                                            <Input
                                                name="phone"
                                                label="Phone"
                                                labelPlacement="outside"
                                                placeholder="050XXXXXXX"
                                                className="w-full"
                                                value={guardianInfo.phone ?? ""}
                                                onChange={handleGuardianInfoChange}
                                            />
                                            <Input
                                                name="postalAddress"
                                                label="Postal Address"
                                                labelPlacement="outside"
                                                placeholder="PO Box XXXX"
                                                className="w-full"
                                                value={guardianInfo.postalAddress ?? ""}
                                                onChange={handleGuardianInfoChange}
                                            />
                                            <Input
                                                name="houseNumber"
                                                label="House Number"
                                                labelPlacement="outside"
                                                placeholder="26"
                                                className="w-full"
                                                value={guardianInfo.houseNumber ?? ""}
                                                onChange={handleGuardianInfoChange}
                                            />
                                        </div>
                                    </>
                                    :
                                    modalAction === "view" ?
                                        <Card className="w-full">
                                            <CardHeader className="flex gap-3">
                                                <UserRound className="border border rounded-lg" size={40} />
                                                <div className="flex flex-col">
                                                    <p className="text-md">{capitalize(studentInfo.surname)} {capitalize(studentInfo.otherNames)}</p>
                                                    <p className="text-small text-default-500">{studentInfo.gender} | {studentInfo.currentClass.name}</p>
                                                </div>
                                            </CardHeader>
                                            <Divider />
                                            <CardBody className="gap-4">
                                                <h1 className="font-bold">Personal</h1>
                                                <div className="mx-4">
                                                    <p><b>Surname</b>: {studentInfo.surname}</p>
                                                    <p><b>OtherNames</b>: {studentInfo.otherNames}</p>
                                                    <p><b>Gender</b>: {studentInfo.gender === "m" ? "Male" : "Female"}</p>
                                                    <p><b>Age</b>: {studentInfo.age}</p>
                                                    <p><b>Current Class</b>: {studentInfo.currentClass?.name}</p>
                                                    <p><b>Religion</b>: {studentInfo.religion}</p>
                                                    <p><b>DateOfBirth</b>: {new Date(studentInfo.dateOfBirth).toLocaleDateString()}</p>
                                                    <p><b>Place Of Birth</b>: {studentInfo.placeOfBirth}</p>
                                                </div>

                                                <h1 className="font-bold">Guardian Info</h1>
                                                <div className="mx-4">
                                                    {!guardianInfo.id ?
                                                        <div className="flex flex-row ju">
                                                            <p className="mx-4">Guardian info not found</p>
                                                        </div> :
                                                        <>
                                                            <p>Guardian Name: {guardianInfo.fullname || "N/A"}</p>
                                                            <p>Occupation: {guardianInfo.occupation || "N/A"}</p>
                                                            <p>Edu. Backgroub: {guardianInfo.educationalBackground || "N/A"}</p>
                                                            <p>Phone: {guardianInfo.phone || "N/A"}</p>
                                                            <p>Postal Add: {guardianInfo.postalAddress || "N/A"}</p>
                                                            <p>House No: {guardianInfo.houseNumber || "N/A"}</p>
                                                        </>
                                                    }
                                                </div>
                                            </CardBody>
                                            <Divider />
                                        </Card>
                                        : modalAction === "delete" ?
                                            <Card className="w-full">
                                                <CardHeader className="flex gap-3">
                                                    <UserRound className="border border rounded-lg" size={40} />
                                                    <div className="flex flex-col">
                                                        <p className="text-md">{studentInfo.surname} {studentInfo.otherNames}</p>
                                                        <p className="text-small text-default-500">{studentInfo.gender} | {studentInfo.currentClass?.name}</p>
                                                    </div>
                                                </CardHeader>
                                                <Divider />
                                                <CardBody className="gap-4">
                                                    <h1 className="">Are you sure you want to delete this student?</h1>
                                                    <Button className="color-brand-100" color="primary" onPress={() => handleDeleteStudent()}>
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
                                    <Button type="submit" color="primary" onPress={handleCreateNewStudent}>
                                        Submit
                                    </Button>
                                    : modalAction === "update" ?
                                        <Button onPress={handleUpdateStudentInfo} type="submit" color="primary">
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
