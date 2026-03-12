"use client"

import { useState, FormEvent } from "react"
import Image from "next/image";
import IdeaLogo from "../../../public/images/idea.jpg"
import { Form, Input, Button } from "@heroui/react";
import { BaseErrMsg, BaseRequestHeaders } from "@/lib/utils";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

export default function SignInPage() {

    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSignin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const fn = async () => {
            const response = await fetch("/api/auth", {
                method: "POST",
                headers: { ...BaseRequestHeaders },
                body: JSON.stringify({ username, password })
            })
            const result = await response.json()
            if (!response.ok) {
                return Promise.reject(result.message)
            } else {
                return Promise.resolve(result.message)
            }
        }
        await toast.promise(
            fn,
            {
                pending: "Signing in...",
                success: {
                    render({ data }: { data: string }) {
                        window.location.href = "/dashboard"
                        return `Login success. ${data}`
                    }
                },
                error: "Invalid email "
            }
        )
    }

    return (
        <main className="h-dvh flex items-center justify-center p-6">
            <div className="w-full max-w-sm rounded-2xl bg-card p-6 ring-1 ring-border">
                <div className="flex flex-row justify-center items-center">
                    <Image
                        src={IdeaLogo}
                        alt="idea-logo"
                        width={70}
                        height={70}
                        className="rounded-md object- opacity-90"
                    />
                </div>


                <h1 className="text-2xl font-semibold text-foreground mt-4 text-balance">Sign in</h1>
                <p className="text-sm text-muted-foreground mb-6">Welcome back. Enter your credentials.</p>

                <Form onSubmit={handleSignin} className="grid gap-4">
                    <Input
                        isRequired
                        label="Username"
                        labelPlacement="outside"
                        placeholder="Enter your username"
                        className="w-full mb-4"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <Input
                        isRequired
                        label="Password"
                        labelPlacement="outside"
                        name="password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button type="submit" color="primary" className="text-center mt-4">
                        Submit
                    </Button>
                </Form>
            </div>
        </main>
    )
}
