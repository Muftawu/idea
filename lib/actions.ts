import { cookies } from "next/headers";

type authTokens = {
    user_id: string,
    access: string,
    refresh: string
}

export const setAuthTokens = async (tokens: authTokens) => {
    const cookieStore = await cookies()
    cookieStore.set("user_id", tokens.user_id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })
    cookieStore.set("access_token", tokens.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })
    cookieStore.set("refresh_token", tokens.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })
}

export const updateAccessToken = async (access_token: string) => {
    const cookieStore = await cookies()
    cookieStore.set("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })
}

export const refetchTokens = async (refresh_token: string) => {
    if (!refresh_token) {
        return false
    }
    const response = await fetch(`${process.env.BASE_API_URL}/auth/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            refresh: refresh_token
        })
    })
    const result = await response.json()
    if (!response.ok) {
        return false
    }
    await updateAccessToken(result.access)
    return true
}

export const removeAuthTokens = async () => {
    const cookieStore = await cookies()
    cookieStore.delete("user_id")
    cookieStore.delete("access_token")
    cookieStore.delete("refresh_token")
    return true
}
