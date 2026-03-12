import { BaseRequestHeaders } from '@/lib/utils';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from "next/headers";
import { refetchTokens, removeAuthTokens } from '@/lib/actions';

const baseApiUrl = `${process.env.BASE_API_URL}/stats`

const getFn = async (query: string) => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")?.value ?? ""

    const response = await fetch(`${baseApiUrl}/${query}`, {
        headers: {
            ...BaseRequestHeaders,
            "Authorization": `Bearer ${access_token}`
        }
    })
    const result = await response.json()
    return { response, result }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query") ?? ""

    let out = await getFn(query)
    if (!out?.response.ok) {
        if (out?.response.status === 401) {
            const cookieStore = await cookies()
            const refresh_token = cookieStore.get("refresh_token")?.value ?? ""
            const refetchSuccess = await refetchTokens(refresh_token)
            if (refetchSuccess) {
                out = await getFn(query)
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
