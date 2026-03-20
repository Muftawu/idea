import { StudentConductSchemaT } from "@/lib/schemas";

export type RecordOptionSchema = {
    classGroup: string,
    academicTerm: string,
    type: "option",
    conductObj?: StudentConductSchemaT,
    recordObj: {
        id: string,
        academicTerm: string,
        scoreValue: string,
        classSubject: string,
        student: string
    }
}

export type RecordOptionPackage = {
    academicTerm: string,
    conduct?: StudentConductSchemaT,
    classGroup: string,
    student: string,
    records: {
        classSubject: string,
        scoreValue: string
    }[]
}

export type RecordNumberSchema = {
    classGroup: string,
    academicTerm: string,
    type: "number",
    conductObj?: StudentConductSchemaT,
    recordObj: {
        id: string,
        academicTerm: string,
        classScoreValue: string,
        examScoreValue: string,
        classSubject: string,
        student: string
    }
}

export type RecordNumberPackage = {
    academicTerm: string,
    conduct?: StudentConductSchemaT,
    classGroup: string,
    student: string,
    records: {
        classSubject: string,
        classScoreValue: string
        examScoreValue: string
    }[]
}

