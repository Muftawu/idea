import * as z from "zod";

// USER
const UserSchema = z.object({
    id: z.string().optional(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string(),
    userType: z.string(),
    userTypeId: z.string().optional(),
    phone: z.string(),
    gender: z.string(),
    dateOfBirth: z.date(),
    nationality: z.string().optional()
})

// STAT
const StaffStatsSchema = z.object({
    maleCount: z.number(),
    femaleCount: z.number(),
    malePercentage: z.number(),
    femalePercentage: z.number()
})

const StudentStatsSchema = z.object({
    maleCount: z.number(),
    femaleCount: z.number(),
    malePercentage: z.number(),
    femalePercentage: z.number()
})

const AdminStatsSchema = z.object({
    totalStudents: z.number(),
    totalStaff: z.number(),
    totalClasses: z.number(),
})

// SCHOOL
const SchoolSettingsSchema = z.object({
    name: z.string(),
    currentTerm: z.string(),
    termStarts: z.date(),
    termEnds: z.date(),
})

const StaffCredentialSchema = z.object({
    username: z.string(),
    password: z.string(),
})

const ClassRoomSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    classTeacher: z.string().optional(),
    classGroup: z.string().optional(),
    classTeacherName: z.string().optional(),
    studentCount: z.number().optional(),
})

const MinimalStudentInfoSchema = z.object({
    student_id: z.string(),
    student__surname: z.string(),
    student__otherNames: z.string(),
    student__gender: z.string(),
})

const StaffInfoSchema = z.object({
    id: z.string().optional(),
    staffId: z.string(),
    personalInfo: UserSchema,
    staffCredentials: StaffCredentialSchema,
    placeOfBirth: z.string().optional(),
    academicQualification: z.string().optional(),
    professionalQualification: z.string().optional(),
    placeOfResidence: z.string().optional(),
    hometown: z.string().optional(),
    bankAccNo: z.string().optional(),
    socialSecNo: z.string().optional(),
    assignedClasses: z.array(ClassRoomSchema).optional(),
    assignedClassStudentsList: z.array(MinimalStudentInfoSchema).optional()
})

// SUBJECT //
const SubjectSchema = z.object({
    id: z.string().optional(),
    subjectName: z.string(),
})

const SubjectStatsSchema = z.object({
    subjectsCount: z.number(),
})

const ClassSubjectGroupSchema = z.object({
    id: z.string().optional(),
    name: z.string(),
    scoreType: z.string(),
    subjects: z.array(SubjectSchema).optional(),
})

const CurrentClassDetailSchema = z.object({
    id: z.string().optional(),
    name: z.string().optional(),
    classGroup: z.string().optional()
})

// STUDENT //
const StudentSchema = z.object({
    id: z.string().optional(),
    surname: z.string(),
    otherNames: z.string(),
    dateOfBirth: z.date(),
    placeOfBirth: z.string().optional(),
    gender: z.string().optional(),
    nationality: z.string(),
    religion: z.string(),
    schoolsAttended: z.string().optional(),
    healthProblems: z.string().optional(),
    currentClass: CurrentClassDetailSchema,
    age: z.number(),
    guardianId: z.string()
})

// GUARDIAN //
const GuardianSchema = z.object({
    id: z.string().optional(),
    fullname: z.string(),
    occupation: z.string().optional(),
    educationalBackground: z.string(),
    phone: z.string().optional(),
    postalAddress: z.string().optional(),
    houseNumber: z.string().optional(),
})

const StudentConductSchema = z.object({
    rollNo: z.number(),
    attendance: z.number(),
    attitude: z.string().optional(),
    conduct: z.string(),
    interest: z.string().optional(),
    teacherRemarks: z.string(),
    promotedTo: z.string().optional(),
})

export type ClassRoomSchemaT = z.infer<typeof ClassRoomSchema>
export type UserSchemaT = z.infer<typeof UserSchema>
export type StaffT = z.infer<typeof StaffInfoSchema>
export type ClassSubjectGroupT = z.infer<typeof ClassSubjectGroupSchema>
export type StaffStatSchemaT = z.infer<typeof StaffStatsSchema>
export type StudentSchemaT = z.infer<typeof StudentSchema>
export type GuardianSchemaT = z.infer<typeof GuardianSchema>
export type StudentStatsSchemaT = z.infer<typeof StudentStatsSchema>
export type SubjectSchemaT = z.infer<typeof SubjectSchema>
export type SubjectStatsSchemaT = z.infer<typeof SubjectStatsSchema>
export type AdminStatsSchemaT = z.infer<typeof AdminStatsSchema>
export type SchoolSettingsSchemaT = z.infer<typeof SchoolSettingsSchema>
export type MinimalStudentInfoSchemaT = z.infer<typeof MinimalStudentInfoSchema> 
export type StudentConductSchemaT = z.infer<typeof StudentConductSchema> 
