"use client"

import { Bell, Search, Settings, User, Menu, SunMoon } from "lucide-react"
import { useContext, useState } from "react"
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
import { Spinner } from "@heroui/react"
import { BaseErrMsg, BaseRequestHeaders } from "@/lib/utils"
import { toast } from "react-toastify"

interface TopbarProps {
    onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
    const authInfo = useAuthContext()
    const [q, setQ] = useState("")

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

                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <label className="relative block">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Search className="size-4" />
                        </span>
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Search rooms, devices, or users..."
                            className="w-full rounded-full border bg-background pl-9 pr-3 py-2 text-sm"
                            aria-label="Search"
                        />
                    </label>
                </div>

                {/* Actions */}
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
                            <DropdownMenuItem>Washer cycle completed</DropdownMenuItem>
                            <DropdownMenuItem>Front door locked</DropdownMenuItem>
                            <DropdownMenuItem>HVAC filter reminder</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-muted-foreground">View all</DropdownMenuItem>
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
                            <DropdownMenuItem asChild>
                                <a href="/devices">My devices</a>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleLogout()} className="text-destructive cursor-pointer">Sign out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
