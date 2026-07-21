"use client";

import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
} from "@react-pdf/renderer";
import { RecordNumberPackage, RecordOptionPackage } from "./reportSchema";
import { toast } from "react-toastify";

export type Grade = "A" | "P" | "AP" | "D" | "B" | string;

export type SubjectRow = {
    classSubject: string;
    classScoreValue: number;
    scoreValue?: string,
    examScoreValue: number;
    totalScore: number;
    grade: string;
    position?: string;
    facilitator?: string;
};

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
    // Grade colors
    gradeA: "#166534", gradeABg: "#dcfce7",
    gradeP: "#1d6fa4", gradePBg: "#e8f4fd",
    gradeAP: "#854d0e", gradeAPBg: "#fef9c3",
    gradeD: "#9a3412", gradeDBg: "#ffedd5",
    gradeB: "#be123c", gradeBBg: "#ffe4e6",
};

const gradeColor = (g: Grade) => {
    switch (g?.toUpperCase()) {
        case "A": return { bg: C.gradeABg, text: C.gradeA };
        case "P": return { bg: C.gradePBg, text: C.gradeP };
        case "AP": return { bg: C.gradeAPBg, text: C.gradeAP };
        case "D": return { bg: C.gradeDBg, text: C.gradeD };
        default: return { bg: C.gradeBBg, text: C.gradeB };
    }
};


const val = (v: any, fallback = "—") => {
    const s = String(v ?? "").trim();
    return s && s.toLowerCase() !== "none" && s !== "0" && s !== "0.00" ? s : fallback;
};

const s = StyleSheet.create({
    page: {
        backgroundColor: C.bg,
        fontFamily: "Helvetica",
        paddingBottom: 28,
    },

    // ── Header ──
    headerBand: {
        backgroundColor: C.brand,
        paddingVertical: 18,
        paddingHorizontal: 32,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    schoolName: {
        fontSize: 16,
        fontFamily: "Helvetica-Bold",
        color: C.white,
        letterSpacing: 1,
    },
    schoolSub: {
        fontSize: 7,
        color: "#ffe0c7",
        marginTop: 3,
        letterSpacing: 0.5,
    },
    schoolContact: {
        fontSize: 6.5,
        color: "#ffcba4",
        marginTop: 4,
    },
    reportBadge: {
        backgroundColor: C.white,
        borderRadius: 4,
        paddingVertical: 6,
        paddingHorizontal: 14,
        alignItems: "center",
    },
    reportBadgeTop: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
        letterSpacing: 1.4,
    },
    reportBadgeMain: {
        fontSize: 10,
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
        paddingHorizontal: 28,
        paddingTop: 14,
    },

    // ── Two-column layout ──
    twoCol: {
        flexDirection: "row",
        gap: 0,
        marginBottom: 12,
    },
    colLeft: { flex: 2, marginRight: 10 },
    colRight: { flex: 1 },

    // ── Student Info Card ──
    infoCard: {
        backgroundColor: C.white,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
    },
    infoCardHeader: {
        backgroundColor: C.brandLight,
        borderBottomWidth: 1.5,
        borderBottomColor: C.brandMid,
        paddingVertical: 6,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    infoCardDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: C.brand,
        marginRight: 7,
    },
    infoCardTitle: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: C.brandDark,
        letterSpacing: 1.1,
    },
    infoGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    infoCell: {
        width: "33.33%",
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        borderRightWidth: 1,
        borderRightColor: C.border,
    },
    infoCellHalf: {
        width: "50%",
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        borderRightWidth: 1,
        borderRightColor: C.border,
    },
    infoCellFull: {
        width: "100%",
        paddingVertical: 7,
        paddingHorizontal: 10,
        borderRightWidth: 1,
        borderRightColor: C.border,
    },
    infoLabel: {
        fontSize: 6,
        color: C.muted,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.7,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: C.black,
    },
    infoValueMuted: {
        fontSize: 9,
        color: C.mid,
        fontStyle: "italic",
    },

    // ── Summary Stats (right column) ──
    summaryCard: {
        backgroundColor: C.white,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        flex: 1,
    },
    summaryHeader: {
        backgroundColor: C.brandLight,
        borderBottomWidth: 1.5,
        borderBottomColor: C.brandMid,
        paddingVertical: 6,
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    summaryHeaderText: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: C.brandDark,
        letterSpacing: 1.1,
    },
    summaryBody: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    summaryBigNumber: {
        fontSize: 30,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
        lineHeight: 1,
    },
    summarySubLabel: {
        fontSize: 6.5,
        color: C.muted,
        letterSpacing: 0.6,
        fontFamily: "Helvetica-Bold",
        marginTop: 3,
        textAlign: "center",
    },
    summaryDivider: {
        height: 1,
        backgroundColor: C.border,
        marginVertical: 6,
        width: "100%",
    },
    summarySmall: {
        fontSize: 7.5,
        color: C.mid,
        textAlign: "center",
    },
    summarySmallBold: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: C.dark,
        textAlign: "center",
    },

    // ── Section heading ──
    sectionHeading: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    sectionLine: {
        height: 2,
        backgroundColor: C.brand,
        width: 20,
        borderRadius: 1,
        marginRight: 7,
    },
    sectionTitle: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
        letterSpacing: 1.3,
    },

    // ── Subject Table ──
    table: {
        backgroundColor: C.white,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        marginBottom: 10,
    },
    tableHeaderRow: {
        flexDirection: "row",
        backgroundColor: C.dark,
        paddingVertical: 7,
        alignItems: "center",
    },

    // column widths (A4 portrait, ~536pt content width at 28px padding each side)
    cSubject: { width: "28%", paddingLeft: 10 },
    cClassScore: { width: "11%", alignItems: "center" },
    cExamScore: { width: "11%", alignItems: "center" },
    cTotal: { width: "13%", alignItems: "center" },
    cGrade: { width: "8%", alignItems: "center" },
    cPosition: { width: "8%", alignItems: "center" },
    cFacilitator: { width: "13%", paddingLeft: 4 },

    cSubjectIdle: { width: "28%", paddingLeft: 10 },
    cClassScoreIdle: { width: "18%", alignItems: "center" },
    cExamScoreIdle: { width: "18%", alignItems: "center" },
    cTotalIdle: { width: "18%", alignItems: "center" },
    cGradeIdle: { width: "18%", alignItems: "center" },


    thText: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#aaaaaa",
        letterSpacing: 0.6,
        textAlign: "center",
    },
    thTextLeft: {
        fontSize: 6,
        fontFamily: "Helvetica-Bold",
        color: "#aaaaaa",
        letterSpacing: 0.6,
    },

    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        borderTopWidth: 1,
        borderTopColor: C.border,
        minHeight: 28,
    },
    tableRowAlt: { backgroundColor: C.rowAlt },

    tdSubject: {
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: C.dark,
        paddingLeft: 10,
        paddingRight: 4,
        lineHeight: 1.3,
    },
    tdScore: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: C.dark,
        textAlign: "center",
    },
    tdScoreMuted: {
        fontSize: 9,
        color: C.muted,
        textAlign: "center",
    },
    tdFacilitator: {
        fontSize: 7.5,
        color: C.mid,
        paddingLeft: 4,
        paddingRight: 4,
    },
    tdPosition: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: C.dark,
        textAlign: "center",
    },

    // grade pill
    gradePill: {
        borderRadius: 20,
        paddingVertical: 2,
        paddingHorizontal: 6,
        alignItems: "center",
    },
    gradeText: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.4,
    },

    // score bar
    barTrack: {
        height: 5,
        backgroundColor: C.border,
        borderRadius: 3,
        width: "100%",
        overflow: "hidden",
    },
    barFill: {
        height: 5,
        borderRadius: 3,
    },

    // ── Grading Key ──
    gradingCard: {
        backgroundColor: C.white,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        marginBottom: 10,
    },
    gradingRow: {
        flexDirection: "row",
    },
    gradingCell: {
        flex: 1,
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderRightWidth: 1,
        borderRightColor: C.border,
        alignItems: "center",
    },
    gradingPctText: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        marginBottom: 2,
    },
    gradingMeaningText: {
        fontSize: 6.5,
        textAlign: "center",
    },

    // ── Remarks + Attitude row ──
    remarksRow: {
        flexDirection: "row",
        marginBottom: 10,
    },
    attitudeCard: {
        flex: 1,
        backgroundColor: C.white,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        marginRight: 10,
    },
    remarksCard: {
        flex: 1,
        backgroundColor: C.white,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
    },
    boxHeader: {
        backgroundColor: C.brandLight,
        borderBottomWidth: 1.5,
        borderBottomColor: C.brandMid,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    boxHeaderText: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: C.brandDark,
        letterSpacing: 1,
    },
    boxBody: {
        padding: 10,
    },
    attitudeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
    },
    attitudeLabel: {
        fontSize: 7.5,
        color: C.mid,
        fontFamily: "Helvetica-Bold",
    },
    attitudeValue: {
        fontSize: 8,
        color: C.dark,
        fontStyle: "italic",
    },
    remarksText: {
        fontSize: 8.5,
        color: C.mid,
        fontStyle: "italic",
        lineHeight: 1.5,
    },

    // ── Bottom row: sign ──
    bottomRow: {
        flexDirection: "row",
    },
    signBox: {
        flex: 1,
        backgroundColor: C.white,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        marginRight: 10,
    },
    signBoxLast: {
        marginRight: 0,
    },
    signBoxBody: {
        padding: 5,
        maxHeight: 7,
    },
    signLine: {
        borderBottomWidth: 1.5,
        borderBottomColor: C.borderStrong,
        marginTop: 7,
        marginBottom: 0,
    },
    signLabel: {
        fontSize: 6.5,
        color: C.muted,
        textAlign: "center",
        letterSpacing: 0.6,
    },

    // ── Footer ──
    footer: {
        position: "absolute",
        bottom: 14,
        left: 28,
        right: 28,
        borderTopWidth: 1,
        borderTopColor: C.border,
        paddingTop: 6,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerText: { fontSize: 6.5, color: C.muted },
});

const InfoCell = ({
    label, value, half = false, full = false,
}: { label: string; value: string; half?: boolean; full?: boolean }) => (
    <View style={full ? s.infoCellFull : half ? s.infoCellHalf : s.infoCell}>
        <Text style={s.infoLabel}>{label.toUpperCase()}</Text>
        <Text style={value === "—" ? s.infoValueMuted : s.infoValue}>{value}</Text>
    </View>
);

const SubjectTableRow = ({ row, index, isJHS }: { row: SubjectRow; index: number, isJHS: boolean }) => {
    const gc = gradeColor(row.grade);
    const hasClassScore = row.classScoreValue > 0;
    const hasExamScore = row.examScoreValue > 0;
    const hasTotal = row.totalScore > 0;

    return (
        isJHS ?
            < View style={[s.tableRow, index % 2 === 1 ? s.tableRowAlt : {}]} >
                {/* Subject */}
                < View style={s.cSubject} >
                    <Text style={s.tdSubject}>{row.classSubject}</Text>
                </View >

                {/* Class Score */}
                < View style={s.cClassScore} >
                    <Text style={hasClassScore ? s.tdScore : s.tdScoreMuted}>
                        {hasClassScore ? row.classScoreValue : "—"}
                    </Text>
                </View >

                {/* Exam Score */}
                < View style={s.cExamScore} >
                    <Text style={hasExamScore ? s.tdScore : s.tdScoreMuted}>
                        {hasExamScore ? row.examScoreValue : "—"}
                    </Text>
                </View >

                {/* Total */}
                < View style={s.cTotal} >
                    <Text style={hasTotal ? s.tdScore : s.tdScoreMuted}>
                        {hasTotal ? row.totalScore : "—"}
                    </Text>
                </View >

                {/* Grade */}
                < View style={s.cGrade} >
                    <View style={[s.gradePill, { backgroundColor: gc.bg }]}>
                        <Text style={[s.gradeText, { color: gc.text }]}>{row.grade || "—"}</Text>
                    </View>
                </View >

                {/* Position */}
                < View style={s.cPosition} >
                    <Text style={val(row.position) !== "—" ? s.tdPosition : s.tdScoreMuted}>
                        {val(row.position)}
                    </Text>
                </View >

                <View style={s.cFacilitator}>
                    <Text style={s.tdFacilitator}>{val(row.facilitator)}</Text>
                </View>
            </View >
            :
            <View style={[s.tableRow, index % 2 === 1 ? s.tableRowAlt : {}]}>
                {/* Subject */}
                <View style={s.cSubjectIdle}>
                    <Text style={s.tdSubject}>{row.classSubject}</Text>
                </View>

                {/* Class Score */}
                <View style={s.cClassScoreIdle}>
                    <Text style={hasClassScore ? s.tdScore : s.tdScoreMuted}>
                        {hasClassScore ? row.classScoreValue : "—"}
                    </Text>
                </View>

                {/* Exam Score */}
                <View style={s.cExamScoreIdle}>
                    <Text style={hasExamScore ? s.tdScore : s.tdScoreMuted}>
                        {hasExamScore ? row.examScoreValue : "—"}
                    </Text>
                </View>

                {/* Total */}
                <View style={s.cTotalIdle}>
                    <Text style={hasTotal ? s.tdScore : s.tdScoreMuted}>
                        {hasTotal ? row.totalScore : "—"}
                    </Text>
                </View>

                {/* Grade */}
                <View style={s.cGradeIdle}>
                    <View style={[s.gradePill, { backgroundColor: gc.bg }]}>
                        <Text style={[s.gradeText, { color: gc.text }]}>{row.grade || "—"}</Text>
                    </View>
                </View>
            </View>
    );
};

const GradingKey = () => {
    const grades = [
        { range: "85% +", meaning: "Advance", abbr: "A", color: C.gradeA, bg: C.gradeABg },
        { range: "75% – 84%", meaning: "Proficiency", abbr: "P", color: C.gradeP, bg: C.gradePBg },
        { range: "65% – 74%", meaning: "Approaching Proficiency", abbr: "AP", color: C.gradeAP, bg: C.gradeAPBg },
        { range: "55% – 64%", meaning: "Developing", abbr: "D", color: C.gradeD, bg: C.gradeDBg },
        { range: "Below 54%", meaning: "Beginning", abbr: "B", color: C.gradeB, bg: C.gradeBBg },
    ];
    return (
        <View style={s.gradingCard}>
            <View style={s.boxHeader}>
                <Text style={s.boxHeaderText}>GRADING SCALE</Text>
            </View>
            <View style={s.gradingRow}>
                {grades.map((g) => (
                    <View key={g.abbr} style={[s.gradingCell, { backgroundColor: g.bg }]}>
                        <Text style={[s.gradingPctText, { color: g.color }]}>{g.range}</Text>
                        <Text style={[s.gradingMeaningText, { color: g.color }]}>
                            {g.meaning} ({g.abbr})
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};


export const AcademicReportNumber = ({ academicYear, vacationDate, reopeningDate, totalAttendance, data }: { academicYear: string, vacationDate: string, reopeningDate: string, totalAttendance: number, data: RecordNumberPackage }) => {
    if (!data) return
    const isJHS = data.classGroup === "jhs" ? true : false

    return (
        <Document
            title={`${data.student} - ${data.academicTerm} Terminal Report, ${data.academicYear}`}
            author="IDEA International School"
            subject="Terminal Report Card"
        >
            <Page size="A4" style={s.page}>

                {/* ── Header ── */}
                <View style={s.headerBand}>
                    <View>
                        <Text style={s.schoolName}>IDEA International School</Text>
                        <Text style={s.schoolSub}>Creche · Nursery · Kindergarten · Primary · Basic 9</Text>
                        <Text style={s.schoolContact}>
                            6to6 Soldier Man St · P.O. Box 332 NM, Accra · Tel: 0302 435 836 / 0240 301 438 / 0264 138 878
                        </Text>
                    </View>
                    <View style={s.reportBadge}>
                        <Text style={s.reportBadgeTop}>END OF TERM EXAMINATION</Text>
                        <Text style={s.reportBadgeMain}>Terminal Report</Text>
                    </View>
                </View>
                <View style={s.accentStripe} />

                {/* ── Body ── */}
                <View style={s.body}>

                    {/* Student info + Summary side-by-side */}
                    <View style={s.twoCol}>

                        {/* Left: student info */}
                        <View style={s.colLeft}>
                            <View style={s.infoCard}>
                                <View style={s.infoCardHeader}>
                                    <View style={s.infoCardDot} />
                                    <Text style={s.infoCardTitle}>STUDENT INFORMATION</Text>
                                </View>
                                <View style={s.infoGrid}>
                                    <InfoCell label="Full Name" value={val(data.student)} half />
                                    <InfoCell label="Class" value={val(data.className.toUpperCase().replace("_", " "))} half />
                                    <InfoCell label="Term" value={val(data.academicTerm)} />
                                    <InfoCell label="Academic Year" value={academicYear} />
                                    <InfoCell label="No. on Roll" value={val(data.conduct?.rollNo)} />
                                    <InfoCell label="Attendance" value={`${val(data.conduct?.attendance)} out of ${totalAttendance}`} half />
                                    <InfoCell label="Vacation Date" value={vacationDate ?? "---"} half />
                                    <InfoCell label="Reopening Date" value={reopeningDate ?? "---"} half />
                                    <InfoCell label="Promotion Status" value={val(data.conduct?.promotedTo)} half />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Subject Table */}
                    <View style={s.sectionHeading}>
                        <View style={s.sectionLine} />
                        <Text style={s.sectionTitle}>SUBJECT PERFORMANCE</Text>
                    </View>

                    <View style={s.table}>
                        {/* Table Header */}
                        {isJHS ?

                            <View style={s.tableHeaderRow}>
                                <View style={s.cSubject}>
                                    <Text style={[s.thTextLeft, { paddingLeft: 10 }]}>SUBJECT</Text>
                                </View>
                                <View style={s.cClassScore}>
                                    <Text style={s.thText}>CLASS{"\n"}(50%)</Text>
                                </View>
                                <View style={s.cExamScore}>
                                    <Text style={s.thText}>EXAM{"\n"}(50%)</Text>
                                </View>
                                <View style={s.cTotal}>
                                    <Text style={s.thText}>TOTAL{"\n"}(100%)</Text>
                                </View>
                                <View style={s.cGrade}>
                                    <Text style={s.thText}>GRADE</Text>
                                </View>
                                <View style={s.cPosition}>
                                    <Text style={s.thText}>POSITION</Text>
                                </View>
                                <View style={s.cFacilitator}>
                                    <Text style={[s.thTextLeft, { paddingLeft: 4 }]}>FACILITATOR</Text>
                                </View>
                            </View>
                            :
                            <View style={s.tableHeaderRow}>
                                <View style={s.cSubjectIdle}>
                                    <Text style={[s.thTextLeft, { paddingLeft: 10 }]}>SUBJECT</Text>
                                </View>
                                <View style={s.cClassScoreIdle}>
                                    <Text style={s.thText}>CLASS{"\n"}(50%)</Text>
                                </View>
                                <View style={s.cExamScoreIdle}>
                                    <Text style={s.thText}>EXAM{"\n"}(50%)</Text>
                                </View>
                                <View style={s.cTotalIdle}>
                                    <Text style={s.thText}>TOTAL{"\n"}(100%)</Text>
                                </View>
                                <View style={s.cGradeIdle}>
                                    <Text style={s.thText}>GRADE</Text>
                                </View>
                            </View>
                        }

                        {/* Rows */}
                        {data.records.map((row, i) => (
                            <SubjectTableRow key={i} row={row} index={i} isJHS={isJHS} />
                        ))}
                    </View>

                    {/* Grading Scale */}
                    <GradingKey />

                    {/* Conduct / Remarks */}
                    <View style={s.remarksRow}>
                        <View style={s.attitudeCard}>
                            <View style={s.boxHeader}>
                                <Text style={s.boxHeaderText}>CONDUCT & ATTITUDE</Text>
                            </View>
                            <View style={s.boxBody}>
                                {[
                                    { label: "Conduct", value: val(data.conduct?.conduct) },
                                    { label: "Attitude", value: val(data.conduct?.attitude) },
                                    { label: "Interest", value: val(data.conduct?.interest) },
                                ].map((item) => (
                                    <View key={item.label} style={s.attitudeRow}>
                                        <Text style={s.attitudeLabel}>{item.label}</Text>
                                        <Text style={s.attitudeValue}>{item.value}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                        <View style={s.remarksCard}>
                            <View style={s.boxHeader}>
                                <Text style={s.boxHeaderText}>CLASS TEACHER'S REMARKS</Text>
                            </View>
                            <View style={s.boxBody}>
                                <Text style={s.remarksText}>
                                    {val(data.conduct?.teacherRemarks, "No remarks provided.")}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Signatures */}
                    <View style={s.bottomRow}>
                        <View
                            // style={[s.signBox, i === arr.length - 1 ? s.signBoxLast : {}]}
                            style={[s.signBox,]}
                        >
                            <View style={s.boxHeader}>
                                <Text style={s.boxHeaderText}>Signature/Stamp</Text>
                            </View>
                            <View style={s.signBoxBody}>
                                <View style={s.signLine} />
                                {/* <Text style={s.signLabel}>{label.split("'")[0]}</Text> */}
                            </View>
                        </View>
                    </View>
                </View>

                {/* ── Footer ── */}
                {/* <View style={s.footer}> */}
                {/*     <Text style={s.footerText}>IDEA International School · Accra, Ghana</Text> */}
                {/*     <Text style={s.footerText}>Confidential — For Parent / Guardian Use Only</Text> */}
                {/*     <Text style={s.footerText}>{val(data.academicTerm)} · {val(new Date().getFullYear())}</Text> */}
                {/* </View> */}
            </Page>
        </Document>
    );
};
