import { NextResponse, NextRequest } from 'next/server';
import { refetchTokens, removeAuthTokens, setAuthTokens } from '@/lib/actions';
import { BaseRequestHeaders } from '@/lib/utils';
import { cookies } from 'next/headers';

const getFn = async () => {
    const cookieStore = await cookies()
    const user_id = cookieStore.get("user_id")?.value ?? ""
    const access_token = cookieStore.get("access_token")?.value ?? ""

    const baseApiUrl = process.env.BASE_API_URL

    const response = await fetch(`${baseApiUrl}/users/detail/${user_id}`, {
        headers: {
            ...BaseRequestHeaders,
            "Authorization": `Bearer ${access_token}`
        },
    })
    const result = await response.json()
    return { response, result }
}

export async function GET(request: NextRequest) {
    let out = await getFn()
    if (!out?.response.ok) {
        if (out?.response.status === 401) {
            const cookieStore = await cookies()
            const refresh_token = cookieStore.get("refresh_token")?.value ?? ""
            const refetchSuccess = await refetchTokens(refresh_token)
            if (refetchSuccess) {
                out = await getFn()
            } else {
                await removeAuthTokens()
            }
        } else {
            return NextResponse.json({ message: out?.result.message }, { status: out?.response.status })
        }
    }
    return NextResponse.json(
        { message: out?.result.message, data: out?.result.data },
        { status: out?.response.status }
    )
}

export async function POST(request: Request) {
    const payload = await request.json()

    const response = await fetch(`${process.env.BASE_API_URL}/auth/login/`, {
        method: "POST",
        headers: { ...BaseRequestHeaders },
        body: JSON.stringify(payload)
    })

    const result = await response.json()

    if (!response.ok) {
        return NextResponse.json(
            { message: result.detail ?? "Invalid credentials" },
            { status: response.status }
        )
    }

    await setAuthTokens(result.data)
    return NextResponse.json(
        { message: "Welcome back" }
    )
}


export async function DELETE() {
    const tokens_cleared = await removeAuthTokens()
    if (tokens_cleared) {
        return NextResponse.json(
            null,
            { status: 200 , statusText: "ok"}
        )
    } else {
        return NextResponse.json(
            null,
            { status: 400 }
        )
    }
}

