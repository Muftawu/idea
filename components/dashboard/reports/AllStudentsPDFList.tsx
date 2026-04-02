"use client";

import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";
import { ClassRoomSchemaT, MinimalStudentInfoSchemaT, NonTeachingStaffSchemaT } from "@/lib/schemas";

const C = {
    brand: "#ff6501",
    brandDark: "#cc5100",
    brandLight: "#fff3eb",
    brandMid: "#ffd4b0",
    black: "#1a1a1a",
    dark: "#2d2d2d",
    mid: "#555555",
    muted: "#999999",
    border: "#e8e0da",
    borderStrong: "#d0c4ba",
    bg: "#fdfaf7",
    white: "#ffffff",
    rowAlt: "#fdf6f0",
    male: "#1d6fa4",
    maleBg: "#e8f4fd",
    female: "#a0267a",
    femaleBg: "#fdf0f8",
    statBg: "#fff8f3",
};


const s = StyleSheet.create({
    page: {
        backgroundColor: C.bg,
        fontFamily: "Helvetica",
        paddingBottom: 52,          // leave room for fixed footer
    },

    // ── Fixed Header (repeats on each page) ──
    headerBand: {
        backgroundColor: C.brand,
        paddingVertical: 20,
        paddingHorizontal: 36,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    schoolName: {
        fontSize: 17,
        fontFamily: "Helvetica-Bold",
        color: C.white,
        letterSpacing: 1.1,
    },
    schoolSub: {
        fontSize: 7.5,
        color: "#ffe0c7",
        marginTop: 3,
        letterSpacing: 0.5,
    },
    schoolContact: {
        fontSize: 6.5,
        color: "#ffcba4",
        marginTop: 5,
        letterSpacing: 0.3,
    },
    reportBadge: {
        backgroundColor: C.white,
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 14,
        alignItems: "center",
    },
    reportBadgeTop: {
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
        letterSpacing: 1.4,
    },
    reportBadgeMain: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: C.brandDark,
        marginTop: 2,
    },
    accentStripe: {
        height: 4,
        backgroundColor: C.brandDark,
    },

    // ── Body ──
    body: {
        paddingHorizontal: 36,
        paddingTop: 20,
    },

    // ── Class Info Card ──
    infoCard: {
        backgroundColor: C.white,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        marginBottom: 16,
    },
    infoCardHeader: {
        backgroundColor: C.brandLight,
        borderBottomWidth: 1.5,
        borderBottomColor: C.brandMid,
        paddingVertical: 8,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    infoCardDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: C.brand,
        marginRight: 8,
    },
    infoCardTitle: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: C.brandDark,
        letterSpacing: 1.2,
    },
    infoGrid: {
        flexDirection: "row",
    },
    infoCell: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRightWidth: 1,
        borderRightColor: C.border,
    },
    infoLabel: {
        fontSize: 8,
        color: C.muted,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.8,
        marginBottom: 3,
    },
    infoValue: {
        fontSize: 12,
        fontFamily: "Helvetica-Bold",
        color: C.black,
    },
    infoValueSub: {
        fontSize: 8,
        color: C.mid,
        marginTop: 2,
    },

    // ── Stats Row ──
    statsRow: {
        flexDirection: "row",
        marginBottom: 16,
        gap: 0,
    },
    statCard: {
        flex: 1,
        backgroundColor: C.white,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignItems: "center",
        marginRight: 10,
    },
    statCardLast: {
        marginRight: 0,
    },
    statNumber: {
        fontSize: 22,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
    },
    statLabel: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: C.muted,
        letterSpacing: 0.8,
        marginTop: 2,
    },
    statMale: { color: C.male },
    statFemale: { color: C.female },

    // ── Section Heading ──
    sectionHeading: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionLine: {
        height: 2,
        backgroundColor: C.brand,
        width: 24,
        borderRadius: 1,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
        letterSpacing: 1.4,
    },

    // ── Student Table ──
    table: {
        backgroundColor: C.white,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        marginBottom: 20,
    },
    tableHeaderRow: {
        flexDirection: "row",
        backgroundColor: C.dark,
        paddingVertical: 9,
        alignItems: "center",
    },

    // column widths
    colNo: { width: "10%", paddingLeft: 5 },
    colPhoto: { width: "10%", alignItems: "flex-start" },
    colIndex: { width: "10%" },
    colName: { width: "40%", },
    colGender: { width: "10%", alignItems: "center", paddingRight: 5 },
    colDob: { width: "10%", paddingLeft: 20 },
    colSection: { width: "10%", alignItems: "center" },
    colContact: { width: "10%" },

    thText: {
        fontSize: 6.5,
        fontFamily: "Helvetica-Bold",
        color: "#aaaaaa",
        letterSpacing: 0.7,
    },

    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 7,
        borderTopWidth: 1,
        borderTopColor: C.border,
        minHeight: 44,
    },
    tableRowAlt: {
        backgroundColor: C.rowAlt,
    },

    // cell text
    tdNo: {
        fontSize: 8,
        color: C.muted,
        fontFamily: "Helvetica-Bold",
        paddingLeft: 10,
    },
    tdIndex: {
        fontSize: 8,
        color: C.mid,
        fontFamily: "Helvetica-Bold",
    },
    tdNameSurname: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: C.black,
    },
    tdNameOther: {
        fontSize: 8,
        color: C.mid,
        marginTop: 1,
    },
    tdDob: {
        fontSize: 8,
        color: C.dark,
    },
    tdContact: {
        fontSize: 8,
        color: C.dark,
        paddingRight: 8,
    },

    // gender pill
    genderPill: {
        borderRadius: 20,
        paddingVertical: 2,
        paddingHorizontal: 7,
        alignItems: "center",
    },
    genderText: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.5,
    },

    // section pill
    sectionPill: {
        borderRadius: 4,
        paddingVertical: 2,
        paddingHorizontal: 8,
        backgroundColor: C.brandLight,
        alignItems: "center",
    },
    sectionPillText: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: C.brandDark,
    },

    // photo box
    photoBox: {
        width: 22,
        height: 22,
        borderRadius: 50,
        backgroundColor: C.brandLight,
        borderWidth: 1,
        borderColor: C.brandMid,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
    photoPlaceholderText: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
    },

    // ── Bottom: Signature + note ──
    bottomRow: {
        flexDirection: "row",
        marginBottom: 0,
    },
    signBox: {
        flex: 1,
        backgroundColor: C.white,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        marginRight: 14,
    },
    noteBox: {
        flex: 2,
        backgroundColor: C.white,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
    },
    boxHeader: {
        backgroundColor: C.brandLight,
        borderBottomWidth: 1.5,
        borderBottomColor: C.brandMid,
        paddingVertical: 7,
        paddingHorizontal: 14,
    },
    boxHeaderText: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: C.brandDark,
        letterSpacing: 1,
    },
    boxBody: {
        padding: 14,
        minHeight: 55,
    },
    signLine: {
        borderBottomWidth: 1.5,
        borderBottomColor: C.borderStrong,
        marginTop: 38,
        marginBottom: 5,
    },
    signLabel: {
        fontSize: 7,
        color: C.muted,
        textAlign: "center",
        letterSpacing: 0.6,
    },
    noteText: {
        fontSize: 8.5,
        color: C.mid,
        lineHeight: 1.6,
        fontStyle: "italic",
    },

    // ── Fixed Footer ──
    footer: {
        position: "absolute",
        bottom: 20,
        left: 36,
        right: 36,
        borderTopWidth: 1,
        borderTopColor: C.border,
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerLeft: { fontSize: 7, color: C.muted },
    footerCenter: { fontSize: 7, color: C.muted, textAlign: "center", flex: 1, marginHorizontal: 8 },
    footerRight: { fontSize: 7, color: C.muted, textAlign: "right" },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isMale = (g: string) => g?.toLowerCase() === "m";

const initials = (student: MinimalStudentInfoSchemaT) =>
    `${student.student__surname?.[0] ?? ""}${student.student__otherNames?.[0] ?? ""}`.toUpperCase();

// ─── Sub-components ───────────────────────────────────────────────────────────

const GenderPill = ({ gender }: { gender: string }) => {
    const male = isMale(gender);
    return (
        <View style={[s.genderPill, { backgroundColor: male ? C.maleBg : C.femaleBg }]}>
            <Text style={[s.genderText, { color: male ? C.male : C.female }]}>
                {male ? "Male" : "Female"}
            </Text>
        </View>
    );
};

const PhotoCell = ({ item }: { item: MinimalStudentInfoSchemaT }) => (
    <View style={s.photoBox}>
        <Text style={s.photoPlaceholderText}>{initials(item)}</Text>
    </View>
);

const DataRow = ({ item, index }: { item: MinimalStudentInfoSchemaT; index: number }) => (
    <View style={[s.tableRow, index % 2 === 1 ? s.tableRowAlt : {}]} wrap={false}>
        {/* # */}
        <View style={s.colNo}>
            <Text style={s.tdNo}>{String(index + 1).padStart(2, "0")}</Text>
        </View>

        <View style={s.colPhoto}>
            <PhotoCell item={item} />
        </View>

        <View style={s.colName}>
            <Text style={s.tdNameSurname}>{item.student__surname} {item.student__otherNames}</Text>
        </View>

        <View style={s.colGender}>
            <GenderPill gender={item.student__gender ?? "m"} />
        </View>

        <View style={s.colDob}>
            <Text style={s.tdDob}>{item.student__dateOfBirth?.toString() ?? "N/A"}</Text>
        </View>

        {/* <View style={s.colDob}> */}
        {/*     <Text style={s.tdDob}>{item.age ?? 0}</Text> */}
        {/* </View> */}


        {/* Section */}
        {/* <View style={s.colSection}> */}
        {/*     {student.section ? ( */}
        {/*         <View style={s.sectionPill}> */}
        {/*             <Text style={s.sectionPillText}>{student.section}</Text> */}
        {/*         </View> */}
        {/*     ) : ( */}
        {/*         <Text style={[s.tdDob, { color: C.muted }]}>—</Text> */}
        {/*     )} */}
        {/* </View> */}

        {/* Parent Contact */}
        {/* <View style={s.colContact}> */}
        {/*     <Text style={s.tdContact}>{student.parentContact || "—"}</Text> */}
        {/* </View> */}
    </View>
);

// ─── Page Footer (fixed) ──────────────────────────────────────────────────────

const PageFooter = ({ academicTerm, academicYear }: { academicTerm: string, academicYear: string }) => (
    <View style={s.footer} fixed>
        <Text style={s.footerLeft}>IDEA International School · Accra, Ghana</Text>
        <Text style={s.footerCenter}>Confidential — For Internal Use Only</Text>
        <Text
            style={s.footerRight}
            render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}  ·  ${academicTerm} ${academicYear}`
            }
        />
    </View>
);

// ─── Main Document ────────────────────────────────────────────────────────────

export const AllStudentsPDFList = ({ academicTerm, academicYear, data }: { academicTerm: string, academicYear: string, data: ClassRoomSchemaT[] }) => {
    let studentTotal = 0
    let malesArr: number[] = []
    data.filter(obj => obj.studentList?.filter(obj2 => obj2.student__gender === "m" ? malesArr.push(1) : malesArr))
    data.reduce((_, val: ClassRoomSchemaT) => {
        studentTotal += val.studentCount ?? 0
        return studentTotal
    }, studentTotal)
    const males = malesArr.length
    const females = studentTotal - males

    return (
        <Document
            title={`All Student List — ${new Date().toDateString()}`}
            author="IDEA International School"
            subject="All Student List"
        >
            <Page size="A4" style={s.page} orientation="portrait">

                <View style={s.headerBand} fixed>
                    <View>
                        <Text style={s.schoolName}>IDEA International School</Text>
                        <Text style={s.schoolSub}>Creche · Nursery · Kindergarten · Primary · Basic 9</Text>
                        <Text style={s.schoolContact}>
                            6to6 Soldier Man St · P.O. Box 332 NM, Accra · Tel: 0302 435 836 / 0240 301 438
                        </Text>
                    </View>
                    <View style={s.reportBadge}>
                        <Text style={s.reportBadgeTop}>STUDENT REGISTER</Text>
                        <Text style={s.reportBadgeMain}>All Student Data</Text>
                    </View>
                </View>
                <View style={s.accentStripe} fixed />

                <View style={s.body}>
                    <View style={s.infoCard}>
                        <View style={s.infoCardHeader}>
                            <View style={s.infoCardDot} />
                            <Text style={s.infoCardTitle}></Text>
                        </View>
                        <View style={s.infoGrid}>
                            <View style={s.infoCell}>
                                <Text style={s.infoLabel}>TOTAL CLASSES</Text>
                                <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color: C.black }}>
                                    {data.length}
                                </Text>
                            </View>
                            <View style={s.infoCell}>
                                <Text style={s.infoLabel}>MALES</Text>
                                <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color: C.black }}>{males}</Text>
                            </View>
                            <View style={s.infoCell}>
                                <Text style={s.infoLabel}>FEMALES</Text>
                                <Text style={{ fontSize: 16, fontFamily: "Helvetica-Bold", color: C.black }}>{females}</Text>
                            </View>
                            <View style={s.infoCell}>
                                <Text style={s.infoLabel}>SCHOOL ADMIN</Text>
                                <Text style={s.infoValue}>BIG J</Text>
                                <Text style={s.infoValueSub}>020 759 8716</Text>
                            </View>
                        </View>
                    </View>


                    {data.map((item) => (
                        <div key={item.id}>
                            <View style={s.sectionHeading}>
                                <View style={s.sectionLine} />
                                <Text style={s.sectionTitle}>{item.name.toUpperCase()} ({item.studentCount})</Text>
                            </View>

                            <View style={s.table} >
                                {/* Table Header */}
                                < View style={s.tableHeaderRow} fixed >
                                    <View style={s.colNo}>
                                        <Text style={s.thText}>#</Text>
                                    </View>
                                    <View style={s.colIndex}>
                                        <Text style={s.thText}>INITIALS</Text>
                                    </View>
                                    <View style={s.colName}>
                                        <Text style={s.thText}>STUDENT FULL NAME</Text>
                                    </View>
                                    <View style={s.colGender}>
                                        <Text style={[s.thText, { textAlign: "center" }]}>DATE OF BIRTH</Text>
                                    </View>
                                    <View style={s.colDob}>
                                        <Text style={s.thText}>AGE</Text>
                                    </View>
                                    {/* <View style={s.colSection}> */}
                                    {/*     <Text style={[s.thText, { textAlign: "center" }]}>GUARDIAN CONTACT</Text> */}
                                    {/* </View> */}
                                    {/* <View style={s.colContact}> */}
                                    {/*     <Text style={s.thText}>PARENT CONTACT</Text> */}
                                    {/* </View> */}
                                </View>

                                {item.studentList?.map((ditem, index) => (
                                    <DataRow key={index} item={ditem} index={index} />
                                ))}
                            </View>
                        </div>
                    ))}

                    {/* Signature + Note */}
                    <View style={s.bottomRow}>
                        {/* <View style={s.signBox}> */}
                        {/*     <View style={s.boxHeader}> */}
                        {/*         <Text style={s.boxHeaderText}>CLASS TEACHER'S SIGNATURE</Text> */}
                        {/*     </View> */}
                        {/*     <View style={s.boxBody}> */}
                        {/*         <View style={s.signLine} /> */}
                        {/*         <Text style={s.signLabel}>Class Teacher</Text> */}
                        {/*     </View> */}
                        {/* </View> */}
                        <View style={s.signBox}>
                            <View style={s.boxHeader}>
                                <Text style={s.boxHeaderText}>ADMIN'S SIGNATURE</Text>
                            </View>
                            <View style={s.boxBody}>
                                <View style={s.signLine} />
                                <Text style={s.signLabel}>Admin</Text>
                            </View>
                        </View>
                        <View style={s.noteBox}>
                            <View style={s.boxHeader}>
                                <Text style={s.boxHeaderText}>NOTE</Text>
                            </View>
                            <View style={s.boxBody}>
                                <Text style={s.noteText}>
                                    This document is an official staff register for Idea International School.
                                    It is confidential and intended for administrative use only.
                                    Any updates to staff records should be reported to the school administration promptly.
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Fixed Footer with page numbers */}
                < PageFooter academicTerm={academicTerm} academicYear={academicYear} />
            </Page >
        </Document >
    );
};

