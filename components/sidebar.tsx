"use client"
import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import {
    Home,
    UserRound,
    ChevronFirst,
    ChevronLast,
    Users,
    Theater,
    BookOpen,
    SettingsIcon,
    UserRoundPlusIcon
} from "lucide-react"
import Image from "next/image"
import ideaLogo from "../public/images/idea.jpg"
import { AuthContext } from "@/context/authContext"
import { Divider, Spinner } from "@heroui/react"
import { Separator } from "@radix-ui/react-select"

type Item = {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
}

const items: Item[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/staff", label: "Staff", icon: Users },
    { href: "/classrooms", label: "Classes", icon: Theater },
    { href: "/students", label: "Students", icon: UserRoundPlusIcon },
    { href: "/subjects", label: "Subjects", icon: BookOpen },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
    { href: "/profile", label: "Profile", icon: UserRound },
]

const staffItems: Item[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/profile", label: "Profile", icon: UserRound },
]

export function Sidebar() {

    const pathname = usePathname()
    const [open, setOpen] = useState(true)

    const userData = useContext(AuthContext)
    const [menuType, setMenuType] = useState<Item[]>([])
    const itemsType = userData?.userInfo.userType === "admin" ? items : staffItems


    useEffect(() => {
        const saved = localStorage.getItem("sidebar-open")
        if (saved) setOpen(saved === "1")
    }, [])

    useEffect(() => {
        localStorage.setItem("sidebar-open", open ? "1" : "0")
    }, [open])

    if (!userData?.userInfo || !userData?.userInfo.userType) return <Spinner size="sm" />

    return (
        <aside
            className={`bg-brand text-white transition-[width] duration-300 rounded-l-sm flex flex-col h-full  ${open ? "w-52" : "w-20"}`}
            aria-label="Primary navigation"
        >
            <div className="flex items-center justify-between gap-2 px-4 py-5">
                <div className="flex items-center gap-2">
                    <div className="size-9 rounded-xl bg-white/20 grid place-items-center font-bold">
                        <Image
                            height="50"
                            width="50"
                            alt="idea-logo"
                            src={ideaLogo}
                            className="rounded-lg border-border"
                        />

                    </div>
                    <span className={`${open ? "block" : "hidden"} text-sm font-semibold`}>IDEA</span>
                </div>
                <button
                    aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
                    onClick={() => setOpen((v) => !v)}
                    className="rounded-lg bg-white/20 p-1.5 hover:bg-white/30"
                >
                    {open ? <ChevronFirst className="size-5" /> : <ChevronLast className="size-5" />}
                </button>
            </div>
            <Divider />

            <nav className="mt-0 flex-1">
                <ul className="flex flex-col gap-1 px-3">
                    {itemsType.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || (href !== "/" && pathname?.startsWith(href))
                        return (
                            <li key={href}>
                                <Link
                                    href={href}
                                    aria-current={active ? "page" : undefined}
                                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors ${active ? "bg-white text-brand" : "text-white/90 hover:bg-white/10"
                                        }`}
                                >
                                    <Icon className={`size-5 ${active ? "text-brand" : "text-white"}`} />
                                    <span className={`${open ? "block" : "hidden"} text-sm font-bold`}>{label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="px-3 pb-5 pt-2">
                <div className={`rounded-2xl bg-white/10 p-3`}>
                    <p className="text-xs leading-5">{open ? `Idea International, ${new Date().getFullYear()}` : "Tip"}</p>
                </div>
            </div>
        </aside>
    )
}
