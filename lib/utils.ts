import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const ClassGroups = [
    { key: "creche", value: "creche" },
    { key: "nursery_1", value: "nursery_1" },
    { key: "nursery_2", value: "nursery_2" },
    { key: "kg_1", value: "kg_1" },
    { key: "kg_2", value: "kg_2" },
    { key: "lower_primary", value: "lower_primary" },
    { key: "upper_primary", value: "upper_primary" },
    { key: "jhs", value: "jhs" },
]

export const ClassGroupListOptions: string[] = ["creche", "nursery_1", "nursery_2", "kg_1", "kg_2"]
export const ClassGroupListNumber: string[] = ["lower_primary", "upper_primary", "jhs"]

export const BaseRequestHeaders = {
    "Content-Type": "application/json"
}

export const BaseErrMsg = "Something went wrong. Please try again"

export type dynamicFormUpdates = {
    field: string,
    value: string
}

export const Nationalities: string[] = ["Ghanaian", "Other"]

export const EducationalBackgrounds: string[] = ["WASSCE", "Diploma", "Bachelor"]

export const capitalize = (text: string) => {
    if (!text) return ""
    return text[0].toUpperCase() + text.substring(1)
}

type optionsSchema = {
    key: string,
    label: string
}

export const DefaultSubjectScoreOptions: optionsSchema[] = [
    { key: "no", label: "No" },
    { key: "yes", label: "Yes" },
    { key: "always", label: "Always" },
    { key: "sometimes", label: "Sometimes" },
]

export const NurserySubjectScoreOptions: optionsSchema[] = [
    { key: "good", label: "Good" },
    { key: "very_good", label: "Very Good" },
    { key: "excellent", label: "Excellent" },
    { key: "needs_improvements", label: "Needs Improvement" }
]

export const KGSubjectScoreOptions: optionsSchema[] = [
    { key: "good", label: "Good" },
    { key: "very_good", label: "Very Good" },
    { key: "excellent", label: "Excellent" },
    { key: "needs_improvements", label: "Needs Improvement" }
]

export const getSubjectGroupScoreOptions = (subjectGroup?: string) => {
    if (!subjectGroup) return DefaultSubjectScoreOptions
    if (subjectGroup.startsWith("nursery")) return NurserySubjectScoreOptions
    else if (subjectGroup.startsWith("kg")) return KGSubjectScoreOptions
    else return DefaultSubjectScoreOptions
}

export const studentConductFormFields: optionsSchema[] = [
    { key: "roll_no", label: "Number on Roll" },
    { key: "attendance", label: "Attendance" },
    { key: "attitude", label: "Attitude in class" },
    { key: "conduct", label: "Conduct in Class" },
    { key: "interest", label: "Interest" },
    { key: "remarks", label: "Teacher's remarks" },
]
