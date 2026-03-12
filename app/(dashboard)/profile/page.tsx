"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { AuthContext } from "@/context/authContext"
import { capitalize } from "@/lib/utils"
import { Spinner } from "@heroui/react"
import { useContext, useState } from "react"

export default function ProfilePage() {
    const userData = useContext(AuthContext)

    const [notifications, setNotifications] = useState(true)
    const [energySaving, setEnergySaving] = useState(false)

    if (!userData?.userInfo) return <Spinner label="Fetching user info" color="primary" />

    return (
        <div className="h-dvh">
            <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
                <h1 className="text-balance text-2xl font-semibold text-foreground">Profile</h1>
                <p className="mt-2 text-muted-foreground">Manage your profile.</p>

                <div className="mt-6 grid gap-6 md:grid-cols-3">

                    <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                        <div className="flex items-center gap-3">
                            <Avatar className="size-12">
                                <AvatarFallback className="text-lg">{userData.userInfo.first_name.at(0)}{userData.userInfo.last_name.at(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-foreground">{userData.userInfo.first_name} {userData.userInfo.last_name}</p>
                                <p className="text-sm text-muted-foreground">{userData.userInfo.email}</p>
                            </div>
                        </div>
                    </div>


                    <div className="rounded-xl bg-background p-4 ring-1 ring-border">
                        <div className="flex items-center gap-3">
                            <Avatar className="size-12">
                                <AvatarFallback className="text-lg">{userData.userInfo.userType.toUpperCase().at(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium text-foreground">{capitalize(userData.userInfo.userType)}</p>
                                <p className="text-sm text-muted-foreground">User Role</p>
                            </div>
                        </div>
                    </div>

                    {/* <div className="rounded-xl bg-background p-4 ring-1 ring-border"> */}
                    {/*     <h3 className="mb-3 font-medium text-foreground">Preferences</h3> */}
                    {/*     <div className="flex items-center justify-between py-2"> */}
                    {/*         <span className="text-sm text-foreground">Notifications</span> */}
                    {/*         <Switch checked={notifications} onCheckedChange={setNotifications} /> */}
                    {/*     </div> */}
                    {/*     <div className="flex items-center justify-between py-2"> */}
                    {/*         <span className="text-sm text-foreground">Energy-saving mode</span> */}
                    {/*         <Switch checked={energySaving} onCheckedChange={setEnergySaving} /> */}
                    {/*     </div> */}
                    {/* </div> */}

                    {/* <div className="rounded-xl bg-background p-4 ring-1 ring-border"> */}
                    {/*     <h3 className="mb-3 font-medium text-foreground">Shortcuts</h3> */}
                    {/*     <ul className="grid grid-cols-2 gap-3 text-sm"> */}
                    {/*         <li className="rounded-lg bg-primary/10 p-3 text-primary">Good Morning</li> */}
                    {/*         <li className="rounded-lg bg-primary/10 p-3 text-primary">Good Night</li> */}
                    {/*         <li className="rounded-lg bg-primary/10 p-3 text-primary">Away</li> */}
                    {/*         <li className="rounded-lg bg-primary/10 p-3 text-primary">Movie Time</li> */}
                    {/*     </ul> */}
                    {/* </div> */}
                </div>
            </section>
        </div>
    )
}
