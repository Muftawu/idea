"use client"

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Bell, Search, Settings, User, UserRound, SearchIcon, Menu, SunMoon, EyeIcon } from "lucide-react"
import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from "@heroui/react";
import { useContext, useEffect, useRef, useState } from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuthContext } from "@/context/authContext"
import { Input, Spinner } from "@heroui/react"
import { BaseErrMsg, BaseRequestHeaders } from "@/lib/utils"
import { toast } from "react-toastify"
import { NonTeachingStaffSchemaT, StaffT, StudentSchemaT } from "@/lib/schemas";

interface TopbarProps {
    onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {

    const authInfo = useAuthContext()
    const [loading, setLoading] = useState<boolean>(false)
    const [q, setQ] = useState<string>("")
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    // allrefs 
    const studentsRef = useRef<StudentSchemaT[]>([])
    const teachingStaffRef = useRef<StaffT[]>([])
    const nonTeachingStaffRef = useRef<NonTeachingStaffSchemaT[]>([])

    // filters
    const [filteredStudents, setFilteredStudents] = useState<StudentSchemaT[]>([])
    const [filteredTeachingStaff, setFilteredTeachingStaff] = useState<StaffT[]>([])
    const [filteredNonTeachingStaff, setFilteredNonTeachingStaff] = useState<NonTeachingStaffSchemaT[]>([])

    // const [students, setStudents] = useState<StudentSchemaT[]>([])
    const [teachingStaff, setTeachingStaff] = useState<StaffT[]>([])
    const [nonteachingStaff, setNonteachingStaff] = useState<NonTeachingStaffSchemaT[]>([])
    const [filter, setFilter] = useState<(StudentSchemaT | StaffT | NonTeachingStaffSchemaT)[]>([])

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
                    studentsRef.current = result.data
                }
            } catch (err: any) {
            }
        }
        fetchAllStudents()
    }, [])

    useEffect(() => {
        const fetchTeachingStaff = async () => {
            try {
                const response = await fetch(`/api/teaching-staff?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    teachingStaffRef.current = result.data
                }
            } catch (err: any) {
            }
        }
        fetchTeachingStaff()
    }, [])

    useEffect(() => {
        const fetchNonTeachingStaff = async () => {
            try {
                const response = await fetch(`/api/non-teaching-staff?query=all`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    nonTeachingStaffRef.current = result.data
                }
            } catch (err: any) {
            }
        }
        fetchNonTeachingStaff()
    }, [])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Enter" && q.trim().length > 0) {
                handleSearch()
            }
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [q])

    const handleSearch = () => {
        if (q.trim().length < 1) return
        setLoading(true)

        const temp = q.trim().toLowerCase()

        const matchedStudents = studentsRef.current.filter(obj =>
            obj.surname.toLowerCase().startsWith(temp) ||
            obj.otherNames.toLowerCase().startsWith(temp)
        )
        const matchedTeachingStaff = teachingStaffRef.current.filter(obj =>
            obj.personalInfo.last_name.toLowerCase().startsWith(temp) ||
            obj.personalInfo.first_name.toLowerCase().startsWith(temp)
        )
        const matchedNonteachingstaff = nonTeachingStaffRef.current.filter(obj =>
            obj.surname.toLowerCase().startsWith(temp) ||
            obj.otherNames.toLowerCase().startsWith(temp)
        )
        setFilteredStudents(matchedStudents)
        setFilteredTeachingStaff(matchedTeachingStaff)
        setFilteredNonTeachingStaff(matchedNonteachingstaff)
        setLoading(false)
        onOpen()
    }

    if (!authInfo || !authInfo.userInfo) return (
        <div className="flex flex-row justify-end mb-2">
            <Spinner color="warning" size="sm" />
        </div>
    )

    const handleLogout = async () => {
        const fn = async () => {
            try {
                const response = await fetch("/api/auth/", {
                    method: "DELETE",
                    headers: { ...BaseRequestHeaders }
                })
                if (!response.ok) {
                    return Promise.reject(response.status)
                } else {
                    return Promise.resolve(response.status)
                }
            } catch (err: any) {
            }
        }

        await toast.promise(
            fn,
            {
                pending: "Logging out...",
                success: "Logout success.",
                error: BaseErrMsg
            }
        )
        window.location.reload()
    }

    return (
        <header className="lg:-mx-7 sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border mb-6 rounded-xl lg:rounded-none">
            <div className="h-16 px-4 md:px-7  flex items-center justify-between gap-3">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2"
                    aria-label="Open menu"
                >
                    <Menu className="size-5" />
                </button>

                <div className="flex-1 max-w-xl">
                    <label className="relative block">
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            startContent={<SearchIcon />}
                            placeholder="Search students & staff..."
                            className="w-full border rounded-lg"
                            aria-label="Search"
                        />
                    </label>
                </div>

                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="relative rounded-full p-2 hover:bg-muted focus:outline-none focus:ring-2">
                            <Bell className="size-5" aria-hidden />
                            <span className="sr-only">Open notifications</span>
                            <span className="absolute right-1 top-1 inline-flex items-center justify-center text-[10px] bg-red-500 text-white rounded-full h-4 min-w-4 px-1">
                                3
                            </span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-64">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Login Success. Welcome {authInfo.userInfo.first_name}</DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <ThemeToggle />

                    {/* User dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="rounded-full p-1.5 hover:bg-muted focus:outline-none focus:ring-2 cursor-pointer">
                            <Avatar className="size-8">
                                <AvatarFallback>{authInfo.userInfo?.first_name ? authInfo.userInfo.first_name[0] : "U"}</AvatarFallback>
                            </Avatar>
                            <span className="sr-only">Open user menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="flex items-center gap-2">
                                <User className="size-4" />
                                Signed in as {authInfo.userInfo.first_name}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <a href="/profile">Profile</a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleLogout()} className="text-destructive cursor-pointer">Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Modal isOpen={isOpen} size="lg" backdrop="opaque" placement="center" onOpenChange={onOpenChange} className={`overflow-y-auto h-auto max-h-[80%] mx-4 scrollbar-hide`}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col bg-primary text-white mb-4">
                                Search Results for "{q}"
                            </ModalHeader>

                            {loading ? <Spinner /> :
                                <ModalBody className="">

                                    <h1 className="text-primary">Student Match ({filteredStudents.length})</h1>
                                    {filteredStudents.map((item, index) => (
                                        <Card key={index} className="flex w-96 mx-4">
                                            <CardHeader className="flex flex-row justify-between gap-3">
                                                <div className="flex flex-row items-center">
                                                    <UserRound className="border border rounded-lg" size={40} />
                                                    <div className="flex flex-col">
                                                        <p className="text-md mt-1 mx-4 w">{index + 1}. {item.surname} {item.otherNames}</p>
                                                        <p className="text-sm mt-1 mx-8 w">{item.currentClass.name} | {item.gender === "m" ? "Male" : "Female"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button size="sm" isIconOnly color="primary" className="flex flex-end">
                                                        <EyeIcon />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <Divider />
                                        </Card>
                                    ))}
                                    <Divider />

                                    <h1 className="text-primary">Teaching staff match ({filteredTeachingStaff.length})</h1>
                                    {filteredTeachingStaff.map((item, index) => (
                                        <Card key={index} className="flex w-96 mx-4">
                                            <CardHeader className="flex flex-row justify-between gap-3">
                                                <div className="flex flex-row items-center">
                                                    <UserRound className="border border rounded-lg" size={40} />
                                                    <div className="flex flex-col">
                                                        <p className="text-md mt-1 mx-4 w">{index + 1}. {item.personalInfo.last_name} {item.personalInfo.first_name}</p>
                                                        <p className="text-sm mt-1 mx-8 w">Phone: {item.personalInfo.phone ?? "N/A"} | {item.personalInfo.gender === "m" ? "Male" : "Female"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button size="sm" isIconOnly color="primary" className="flex flex-end">
                                                        <EyeIcon />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <Divider />
                                        </Card>
                                    ))}
                                    <Divider />

                                    <h1 className="text-primary">Non-teaching staff match ({filteredNonTeachingStaff.length})</h1>
                                    {filteredNonTeachingStaff.map((item, index) => (
                                        <Card key={index} className="flex w-96 mx-4">
                                            <CardHeader className="flex flex-row justify-between gap-3">
                                                <div className="flex flex-row items-center">
                                                    <UserRound className="border border rounded-lg" size={40} />
                                                    <div className="flex flex-col">
                                                        <p className="text-md mt-1 mx-4 w">{index + 1}. {item.surname} {item.otherNames}</p>
                                                        <p className="text-sm mt-1 mx-8 w">{item.jobDescription} | {item.gender === "m" ? "Male" : "Female"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Button size="sm" isIconOnly color="primary" className="flex flex-end">
                                                        <EyeIcon />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <Divider />
                                        </Card>
                                    ))}
                                    <Divider />


                                </ModalBody>
                            }
                            <ModalFooter>
                                <Button color="default" variant="flat" onPress={() => onClose()}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

        </header>
    )
}
