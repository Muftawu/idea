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

export const Positions: optionsSchema[] = [
    { key: "1", label: "1st" },
    { key: "2", label: "2nd" },
    { key: "3", label: "3rd" },
    { key: "4", label: "4th" },
    { key: "5", label: "5th" },
    { key: "6", label: "6th" },
    { key: "7", label: "7th" },
    { key: "8", label: "8th" },
    { key: "9", label: "9th" },
    { key: "10", label: "10th" },
    { key: "11", label: "11th" },
    { key: "12", label: "12th" },
    { key: "13", label: "13th" },
    { key: "14", label: "14th" },
    { key: "15", label: "15th" },
    { key: "16", label: "16th" },
    { key: "17", label: "17th" },
    { key: "18", label: "18th" },
    { key: "19", label: "19th" },
    { key: "20", label: "20th" },
    { key: "21", label: "21st" },
    { key: "22", label: "22nd" },
    { key: "23", label: "23rd" },
    { key: "24", label: "24th" },
    { key: "25", label: "25th" },
    { key: "26", label: "26th" },
    { key: "27", label: "27th" },
    { key: "28", label: "28th" },
    { key: "29", label: "29th" },
    { key: "30", label: "30th" },
    { key: "31", label: "31st" },
    { key: "32", label: "32nd" },
    { key: "33", label: "33rd" },
    { key: "34", label: "34th" },
    { key: "35", label: "35th" },
    { key: "36", label: "36th" },
    { key: "37", label: "37th" },
    { key: "38", label: "38th" },
    { key: "39", label: "39th" },
    { key: "40", label: "40th" },
    { key: "41", label: "41st" },
    { key: "42", label: "42nd" },
    { key: "43", label: "43rd" },
    { key: "44", label: "44th" },
    { key: "45", label: "45th" },
    { key: "46", label: "46th" },
    { key: "47", label: "47th" },
    { key: "48", label: "48th" },
    { key: "49", label: "49th" },
    { key: "50", label: "50th" },
]

export const AcademicYears: optionsSchema[] = [
    { "key": "2025/2026", label: "2025/2026" },
    { "key": "2026/2027", label: "2026/2027" },
    { "key": "2027/2028", label: "2027/2028" },
    { "key": "2028/2029", label: "2028/2029" },
    { "key": "2029/2030", label: "2029/2030" },
    { "key": "2030/2031", label: "2030/2031" },
    { "key": "2031/2032", label: "2031/2032" },
    { "key": "2032/2033", label: "2032/2033" },
    { "key": "2033/2034", label: "2033/2034" },
    { "key": "2034/2035", label: "2034/2035" },
    { "key": "2035/2036", label: "2035/2036" },
]

