import { StudentConductSchemaT } from "@/lib/schemas";

export type RecordOptionSchema = {
    classGroup: string,
    className: string,
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
    type: "option",
    classGroup: string,
    className: string,
    student: string,
    records: {
        classSubject: string,
        scoreValue: string
    }[]
}

export type RecordNumberSchema = {
    classGroup: string,
    className: string,
    academicTerm: string,
    type: "number",
    conductObj?: StudentConductSchemaT,
    recordObj: {
        id: string,
        academicTerm: string,
        classScoreValue: number,
        examScoreValue: number,
        facilitator?: string, 
        position?: string,
        grade: string,
        totalScore: number,
        classSubject: string,
        student: string
    }
}

export type RecordNumberPackage = {
    academicTerm: string,
    conduct?: StudentConductSchemaT,
    type: "number",
    classGroup: string,
    className: string,
    student: string,
    records: {
        id: string,
        grade: string,
        totalScore: number,
        faciliator?: string,
        position?: string,
        classSubject: string,
        classScoreValue: number,
        examScoreValue: number
    }[]
}

