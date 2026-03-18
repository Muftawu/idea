import { BaseRequestHeaders } from '@/lib/utils';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from "next/headers";
import { ClassRoomSchemaT } from '@/lib/schemas';
import { refetchTokens, removeAuthTokens } from '@/lib/actions';

const baseUrlList = `${process.env.BASE_API_URL}/api-utils/get-subjects-by-class-group`
const baseUrlDetail = `${process.env.BASE_API_URL}/api-utils/get-subjects-by-class-group/`
const allStudentRecordsLink = `${process.env.BASE_API_URL}/api-utils/all-student-academic-records/`

const getFn = async (query: string, student_id?: string) => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")?.value ?? ""

    const link = query === "all" ? baseUrlList : query === "records" ? `${allStudentRecordsLink}${student_id}` : `${baseUrlDetail}${query}`

    const response = await fetch(link, {
        headers: {
            ...BaseRequestHeaders,
            "Authorization": `Bearer ${access_token}`
        },
    })
    const result = await response.json()
    return { response, result }
}

const createFn = async (payload: ClassRoomSchemaT) => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")?.value ?? ""

    const response = await fetch(baseUrlList, {
        method: "POST",
        headers: {
            ...BaseRequestHeaders,
            "Authorization": `Bearer ${access_token}`,
        },
        body: JSON.stringify(payload)
    })
    const result = await response.json()
    return { response, result }
}

const updateFn = async (payload: ClassRoomSchemaT) => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")?.value ?? ""

    const response = await fetch(`${baseUrlDetail}${payload.id}/`, {
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

const deleteFn = async (payload: string) => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")?.value ?? ""

    const response = await fetch(`${baseUrlDetail}${payload}/`, {
        method: "DELETE",
        headers: {
            ...BaseRequestHeaders,
            "Authorization": `Bearer ${access_token}`,
        },
    })
    return { response }
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query") ?? ""
    const student_id = searchParams.get("student_id") ?? ""

    let out = await getFn(query, student_id)
    if (!out?.response.ok) {
        if (out?.response.status === 401) {
            const cookieStore = await cookies()
            const refresh_token = cookieStore.get("refresh_token")?.value ?? ""
            const refetchSuccess = await refetchTokens(refresh_token)
            if (refetchSuccess) {
                out = await getFn(query, student_id)
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

export async function POST(request: NextRequest) {
    const payload = await request.json()

    let out = await createFn(payload)
    if (!out?.response.ok) {
        if (out?.response.status === 401) {
            const cookieStore = await cookies()
            const refresh_token = cookieStore.get("refresh_token")?.value ?? ""
            const refetchSuccess = await refetchTokens(refresh_token)
            if (refetchSuccess) {
                out = await createFn(payload)
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

    let out = await updateFn(payload)
    if (!out?.response.ok) {
        if (out?.response.status === 401) {
            const cookieStore = await cookies()
            const refresh_token = cookieStore.get("refresh_token")?.value ?? ""
            const refetchSuccess = await refetchTokens(refresh_token)
            if (refetchSuccess) {
                out = await updateFn(payload)
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

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const payload = searchParams.get("query") ?? ""

    let out = await deleteFn(payload)
    if (!out?.response.ok) {
        if (out?.response.status === 401) {
            const cookieStore = await cookies()
            const refresh_token = cookieStore.get("refresh_token")?.value ?? ""
            const refetchSuccess = await refetchTokens(refresh_token)
            if (refetchSuccess) {
                out = await deleteFn(payload)
            } else {
                await removeAuthTokens()
            }
        } else {
            return NextResponse.json({ message: "failed" }, { status: out?.response.status })
        }
    }
    return NextResponse.json(
        null,
        { status: 200 }
    )
}
