import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const ClassGroups = [
    {key: "creche", value: "creche"},
    {key: "nursery_1", value: "nursery_1"},
    {key: "nursery_2", value: "nursery_2"},
    {key: "kg_1", value: "kg_1"},
    {key: "kg_2", value: "kg_2"},
    {key: "lower_primary", value: "lower_primary"},
    {key: "upper_primary", value: "upper_primary"},
    {key: "jhs", value: "jhs"},
]

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

export const DefaultSubjectScoreOptions: string[] = ["Yes", "Always", "Sometimes", "No"]

export const capitalize = (text: string) => {
    return text[0].toUpperCase() + text.substring(1)
}

