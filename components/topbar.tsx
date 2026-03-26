"use client"

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@heroui/react";
import { Bell, Search, Settings, User, UserRound, SearchIcon, Menu, SunMoon } from "lucide-react"
import { Card, CardHeader, CardBody, CardFooter, Divider, Button } from "@heroui/react";
import { useContext, useEffect, useState } from "react"
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
import { AuthContext, useAuthContext } from "@/context/authContext"
import { Input, Spinner } from "@heroui/react"
import { BaseErrMsg, BaseRequestHeaders } from "@/lib/utils"
import { toast } from "react-toastify"
import { userInfo } from "os"
import { NonTeachingStaffSchemaT, StaffT, StudentSchemaT } from "@/lib/schemas";

interface TopbarProps {
    onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {

    const authInfo = useAuthContext()
    const [loading, setLoading] = useState<boolean>(false)
    const [doneFiltering, setDoneFiltering] = useState<boolean>(false)
    const [isSearchReady, setSearchReady] = useState<boolean>(false)
    const [q, setQ] = useState<string>("")
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    const [students, setStudents] = useState<StudentSchemaT[]>([])
    const [teachingStaff, setTeachingStaff] = useState<StaffT[]>([])
    const [nonteachingStaff, setNonteachingStaff] = useState<NonTeachingStaffSchemaT[]>([])
    const [filter, setFilter] = useState<(StudentSchemaT | StaffT | NonTeachingStaffSchemaT)[]>([])

    if (!authInfo || !authInfo.userInfo) return (
        <div className="flex flex-row justify-end mb-2">
            <Spinner color="warning" size="sm" />
        </div>
    )

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
                    setStudents(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchAllStudents()
    }, [])

    useEffect(() => {
        const fetchTeachingStaff = async () => {
            try {
                const response = await fetch(`/api/stats?query=teaching-staff`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    setTeachingStaff(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchTeachingStaff()
    }, [])

    useEffect(() => {
        const fetchNonTeachingStaff = async () => {
            try {
                const response = await fetch(`/api/stats?query=teaching-staff`, {
                    headers: { ...BaseRequestHeaders },
                })
                const result = await response.json()
                if (!response.ok) {
                    return
                } else {
                    setNonteachingStaff(result.data)
                }
            } catch (err: any) {
            }
        }
        fetchNonTeachingStaff()
    }, [])

    useEffect(() => {
        if (q.trim().length < 1) return
        document.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                setSearchReady(true)
                setLoading(true)
            } else {
                setSearchReady(false)
            }
        })
    }, [q])

    useEffect(() => {
        if (!isSearchReady) return
        onOpen()
        console.log("q", q)
        setStudents(prev => prev.filter((obj) => obj.surname.startsWith(q) || obj.otherNames.startsWith(q)))
        setStudents(students.filter((obj) => obj.surname.startsWith(q)))
        console.log("done filetering: res", students)
        // setFilter(teachingStaff.filter((obj) => obj.personalInfo.last_name.startsWith(q) || obj.personalInfo.first_name.startsWith(q) ? [...filter, obj] : [...filter]))
        // setFilter(nonteachingStaff.filter((obj) => obj.surname.startsWith(q) || obj.otherNames.startsWith(q) ? [...filter, obj] : [...filter]))

        setLoading(false)
        setDoneFiltering(true)
        setSearchReady(false)
    }, [isSearchReady])

    useEffect(() => {
        setLoading(false)
        if (!doneFiltering) return
        if (loading) return
        setLoading(false)
        setDoneFiltering(false)
    }, [doneFiltering])

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
                                    <p>Students Match (5)</p>
                                    {students.map((item, index) => (
                                        <Card key={index} className="w-full">
                                            <CardHeader className="flex gap-3">
                                                <UserRound className="border border rounded-lg" size={40} />
                                                <div className="flex flex-col">
                                                    <p className="text-md">{item.surname} {item.otherNames}</p>
                                                    {/* <p className="text-small text-default-500">{studentInfo.gender === "m" ? "Male" : "Female"} | {studentInfo.currentClass.name}</p> */}
                                                </div>
                                            </CardHeader>
                                            <Divider />
                                        </Card>
                                    ))}
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
