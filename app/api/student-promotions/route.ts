import { BaseRequestHeaders } from '@/lib/utils';
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from "next/headers";
import { StudentSchemaT } from '@/lib/schemas';
import { refetchTokens, removeAuthTokens } from '@/lib/actions';

const baseUrlDetail = `${process.env.BASE_API_URL}/api-utils/academic/student-promotions/`

type promotionSchema = {
    promotionFrom: string,
    promotionTo: string,
    selectedStudents: string[]
}

const updateFn = async ({payload}: {payload: promotionSchema }) => {
    const cookieStore = await cookies()
    const access_token = cookieStore.get("access_token")?.value ?? ""

    const response = await fetch(`${baseUrlDetail}`, {
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

