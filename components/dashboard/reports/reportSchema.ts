import { StudentConductSchemaT } from "@/lib/schemas";

export type RecordOptionSchema = {
    classGroup: string,
    academicTerm: string,
    conductObj: StudentConductSchemaT,
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
    conduct: StudentConductSchemaT,
    student: string,
    records: {
        classSubject: string,
        scoreValue: string
    }[]
}
