import { BaseRequestHeaders } from '@/lib/utils';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from "next/headers";
import { refetchTokens, removeAuthTokens } from '@/lib/actions';
import { SchoolSettingsSchemaT } from '@/lib/schemas';

const baseApiUrl = `${process.env.BASE_API_URL}/stats`
const baseApiUpdateUrl = `${process.env.BASE_API_URL}/stats/school-settings/`

const getFn = async (query: string, admin_id?: string) => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")?.value ?? ""

    let response
    if (query === "main") {
        response = await fetch(`${baseApiUpdateUrl}${admin_id}`, {
            headers: {
                ...BaseRequestHeaders,
                "Authorization": `Bearer ${access_token}`
            }
        })

    } else {
        response = await fetch(`${baseApiUrl}/${query}`, {
            headers: {
                ...BaseRequestHeaders,
                "Authorization": `Bearer ${access_token}`
            }
        })

    }
    const result = await response.json()
    return { response, result }
}

const updateFn = async (admin_id: string, payload: SchoolSettingsSchemaT) => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")?.value ?? ""

    const response = await fetch(`${baseApiUpdateUrl}${admin_id}/`, {
        method: "PATCH",
        headers: {
            ...BaseRequestHeaders,
            "Authorization": `Bearer ${access_token}`,
        },
        body: JSON.stringify(payload)
    })
    const result = await response.json()
    return { response, result }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query") ?? ""
    const admin_id = searchParams.get("admin_id") ?? ""

    let out = await getFn(query, admin_id)
    if (!out?.response.ok) {
        if (out?.response.status === 401) {
            const cookieStore = await cookies()
            const refresh_token = cookieStore.get("refresh_token")?.value ?? ""
            const refetchSuccess = await refetchTokens(refresh_token)
            if (refetchSuccess) {
                out = await getFn(query, admin_id)
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


export async function PATCH(request: NextRequest) {
    const payload = await request.json()
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query") ?? ""
    const admin_id = searchParams.get("admin_id") ?? ""

    let out = await updateFn(admin_id, payload)
    if (!out?.response.ok) {
        if (out?.response.status === 401) {
            const cookieStore = await cookies()
            const refresh_token = cookieStore.get("refresh_token")?.value ?? ""
            const refetchSuccess = await refetchTokens(refresh_token)
            if (refetchSuccess) {
                out = await updateFn(admin_id, payload)
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
