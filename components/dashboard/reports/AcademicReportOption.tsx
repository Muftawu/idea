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
import { capitalize } from "@/lib/utils";

export type ActivityResult = "YES" | "NO" | "SOMETIMES" | "ALWAYS" | "NEVER";

export type ActivityRow = {
    activity: string;
    result: ActivityResult;
};

export type ReportCardData = {
    studentName: string;
    className: string;
    term: string;
    year: string;
    rollNumber: number;
    vacationDate: string;
    reopeningDate: string;
    promotedTo: string;
    teacherRemarks: string;
    activities: ActivityRow[];
};

const C = {
    brand: "#ff6501",
    brandDark: "#cc5100",
    brandLight: "#fff3eb",
    brandMid: "#ffd4b0",
    black: "#1a1a1a",
    dark: "#2d2d2d",
    mid: "#666666",
    muted: "#999999",
    border: "#e8e0da",
    borderStrong: "#d0c4ba",
    bg: "#fdfaf7",
    white: "#ffffff",
    rowAlt: "#fdf6f0",
    yes: "#2d7a4f",
    yesBg: "#e8f5ee",
    no: "#c0392b",
    noBg: "#fdecea",
    sometimes: "#b45309",
    sometimesBg: "#fef3c7",
    always: "#1d6fa4",
    alwaysBg: "#e8f4fd",
    never: "#7c3aed",
    neverBg: "#f3effe",
};

const s = StyleSheet.create({
    page: {
        backgroundColor: C.bg,
        paddingBottom: 32,
        paddingHorizontal: 0,
        fontFamily: "Helvetica",
    },

    // Header band
    headerBand: {
        backgroundColor: C.brand,
        paddingVertical: 22,
        paddingHorizontal: 36,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerLeft: {
        flex: 1,
    },
    schoolName: {
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        color: C.white,
        letterSpacing: 1.2,
    },
    schoolSub: {
        fontSize: 7.5,
        color: "#ffe0c7",
        marginTop: 3,
        letterSpacing: 0.6,
    },
    schoolContact: {
        fontSize: 6.5,
        color: "#ffcba4",
        marginTop: 5,
        letterSpacing: 0.3,
    },
    headerRight: {
        alignItems: "flex-end",
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
        color: C.brand,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 1.4,
    },
    reportBadgeMain: {
        fontSize: 11,
        color: C.brandDark,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.5,
        marginTop: 2,
    },

    // Accent stripe under header
    accentStripe: {
        height: 4,
        backgroundColor: C.brandDark,
    },

    // Body
    body: {
        paddingHorizontal: 36,
        paddingTop: 22,
    },

    // Student info card
    infoCard: {
        backgroundColor: C.white,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        marginBottom: 20,
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
        flexWrap: "wrap",
    },
    infoCell: {
        width: "33.33%",
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        borderRightWidth: 1,
        borderRightColor: C.border,
    },
    infoCellWide: {
        width: "66.66%",
        paddingVertical: 9,
        paddingHorizontal: 14,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
        borderRightWidth: 1,
        borderRightColor: C.border,
    },
    infoLabel: {
        fontSize: 6.5,
        color: C.muted,
        letterSpacing: 0.8,
        fontFamily: "Helvetica-Bold",
        marginBottom: 3,
    },
    infoValue: {
        fontSize: 10,
        color: C.black,
        fontFamily: "Helvetica-Bold",
    },
    infoValueMuted: {
        fontSize: 10,
        color: C.mid,
        fontStyle: "italic",
    },

    // Section heading
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
        fontSize: 8.5,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
        letterSpacing: 1.4,
    },

    // Activities table
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
    },
    tableHeaderNo: {
        width: "8%",
        paddingLeft: 14,
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: "#aaaaaa",
        letterSpacing: 0.8,
    },
    tableHeaderActivity: {
        width: "68%",
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: "#aaaaaa",
        letterSpacing: 0.8,
    },
    tableHeaderResult: {
        width: "24%",
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: "#aaaaaa",
        letterSpacing: 0.8,
        textAlign: "center",
    },
    tableRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 9,
        borderTopWidth: 1,
        borderTopColor: C.border,
    },
    tableRowAlt: {
        backgroundColor: C.rowAlt,
    },
    tableNo: {
        width: "8%",
        paddingLeft: 14,
        fontSize: 8,
        color: C.muted,
        fontFamily: "Helvetica-Bold",
    },
    tableActivity: {
        width: "68%",
        fontSize: 9,
        color: C.dark,
        paddingRight: 10,
        lineHeight: 1.4,
    },
    tableResultCell: {
        width: "24%",
        alignItems: "center",
        paddingRight: 10,
    },
    resultPill: {
        borderRadius: 20,
        paddingVertical: 3,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    resultText: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        letterSpacing: 0.6,
    },

    // Promotion banner
    promotionBanner: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: C.brandLight,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: C.brand,
        paddingVertical: 10,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    promotionLabel: {
        fontSize: 7.5,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
        letterSpacing: 1,
        marginBottom: 2,
    },
    promotionValue: {
        fontSize: 11,
        fontFamily: "Helvetica-Bold",
        color: C.brandDark,
    },

    // Bottom — remarks + sign
    bottomRow: {
        flexDirection: "row",
    },
    remarksBox: {
        flex: 1,
        backgroundColor: C.white,
        borderRadius: 8,
        borderWidth: 1.5,
        borderColor: C.borderStrong,
        overflow: "hidden",
        marginRight: 14,
    },
    signBox: {
        flex: 1,
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
        minHeight: 70,
    },
    remarksText: {
        fontSize: 9.5,
        color: C.mid,
        fontStyle: "italic",
        lineHeight: 1.6,
    },
    signLine: {
        borderBottomWidth: 1.5,
        borderBottomColor: C.borderStrong,
        marginTop: 40,
        marginBottom: 6,
    },
    signLabel: {
        fontSize: 7,
        color: C.muted,
        textAlign: "center",
        letterSpacing: 0.6,
    },

    // Footer
    footer: {
        marginTop: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: C.border,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    footerLeft: {
        fontSize: 7,
        color: C.muted,
    },
    footerCenter: {
        fontSize: 7,
        color: C.muted,
        textAlign: "center",
        flex: 1,
        marginHorizontal: 10,
    },
    footerRight: {
        fontSize: 7,
        color: C.muted,
        textAlign: "right",
    },
});

const getResultStyle = (result: string) => {
    switch (result) {
        case "YES":
        case "ALWAYS":
            return { pillBg: C.yesBg, textColor: C.yes };
        case "NO":
        case "NEVER":
            return { pillBg: C.noBg, textColor: C.no };
        case "SOMETIMES":
            return { pillBg: C.sometimesBg, textColor: C.sometimes };
        default:
            return { pillBg: C.border, textColor: C.mid };
    }
};

const val = (v: string | number | undefined, fallback = "—") => {
    const str = String(v ?? "").trim();
    return str && str.toLowerCase() !== "none" && str !== "0" ? str : fallback;
};

const InfoCell = ({
    label,
    value,
    wide = false,
}: {
    label: string;
    value: string;
    wide?: boolean;
}) => (
    <View style={wide ? s.infoCellWide : s.infoCell}>
        <Text style={s.infoLabel}>{label.toUpperCase()}</Text>
        <Text style={value === "—" ? s.infoValueMuted : s.infoValue}>{value}</Text>
    </View>
);

const ActivityTableRow = ({
    row,
    index,
}: {
    row: {
        scoreValue: string,
        classSubject: string,
    };
    index: number;
}) => {
    const { pillBg, textColor } = getResultStyle(row.scoreValue);
    return (
        <View style={[s.tableRow, index % 2 === 1 ? s.tableRowAlt : {}]}>
            <Text style={s.tableNo}>{String(index + 1).padStart(2, "0")}</Text>
            <Text style={s.tableActivity}>{row.classSubject}</Text>
            <View style={s.tableResultCell}>
                <View style={[s.resultPill, { backgroundColor: pillBg }]}>
                    <Text style={[s.resultText, { color: textColor }]}>{capitalize(row.scoreValue).replace("_", " ")}</Text>
                </View>
            </View>
        </View>
    );
};

export const AcademicReportOption = ({ data }: { data: RecordOptionPackage | RecordNumberPackage }) => (
    <Document
        title={`${data.records} — ${data.academicTerm} Report`}
        author="Idea International School"
        subject="End of Term Achievement Report"
    >
        <Page size="A4" style={s.page}>

            {/* Header */}
            <View style={s.headerBand}>
                <View style={s.headerLeft}>
                    <Text style={s.schoolName}>IDEA International School</Text>
                    <Text style={s.schoolSub}>
                        Creche · Nursery · Kindergarten · Primary · Basic 9
                    </Text>
                    <Text style={s.schoolContact}>
                        6to6 Soldier Man St · P.O. Box 332 NM, Accra · Tel: 0302 435 836 / 0240 301 438 / 0264 138 878
                    </Text>
                </View>
                <View style={s.headerRight}>
                    <View style={s.reportBadge}>
                        <Text style={s.reportBadgeTop}>END OF TERM EXAMINATION</Text>
                        <Text style={s.reportBadgeMain}>Achievement Report</Text>
                    </View>
                </View>
            </View>
            <View style={s.accentStripe} />

            {/* Body */}
            <View style={s.body}>

                {/* Student Info */}
                <View style={s.infoCard}>
                    <View style={s.infoCardHeader}>
                        <View style={s.infoCardDot} />
                        <Text style={s.infoCardTitle}>STUDENT INFORMATION</Text>
                    </View>
                    <View style={s.infoGrid}>
                        <InfoCell label="Full Name" value={val(data.student)} wide />
                        <InfoCell label="Class" value={val(data.classGroup)} />
                        <InfoCell label="Term" value={val(data.academicTerm)} />
                        <InfoCell label="Academic Year" value={val(new Date().getFullYear())} />
                        <InfoCell label="No. on Roll" value={val(data.conduct?.rollNo)} />
                        <InfoCell label="Attendance" value={val(data.conduct?.attendance)} />
                        <InfoCell label="Vacation Date" value={val(new Date().toLocaleDateString())} />
                        <InfoCell label="Reopening Date" value={val(new Date().toLocaleDateString())} />
                    </View>
                </View>

                {/* Activities Table */}
                <View style={s.sectionHeading}>
                    <View style={s.sectionLine} />
                    <Text style={s.sectionTitle}>PERFORMANCE ASSESSMENT</Text>
                </View>

                <View style={s.table}>
                    <View style={s.tableHeaderRow}>
                        <Text style={s.tableHeaderNo}>#</Text>
                        <Text style={s.tableHeaderActivity}>ACTIVITY / SKILL</Text>
                        <Text style={s.tableHeaderResult}>RESULT</Text>
                    </View>
                    {data.records.map((item, index) => (
                        <ActivityTableRow key={index} row={item} index={index} />
                    ))}
                </View>

                {/* Promotion Banner */}
                {/* {val(data.promotedTo) !== "—" && ( */}
                {/*     <View style={s.promotionBanner}> */}
                {/*         <View style={{ marginRight: 12 }}> */}
                {/*             <Text style={s.promotionLabel}>PROMOTED TO</Text> */}
                {/*             <Text style={s.promotionValue}>{val(data.promotedTo)}</Text> */}
                {/*         </View> */}
                {/*     </View> */}
                {/* )} */}

                <View>
                    <View style={s.boxHeader}>
                        <Text style={s.boxHeaderText}>ATTITUDE IN CLASS</Text>
                        <Text style={[s.remarksText, { marginHorizontal: 8 }]}>
                            {val(data.conduct?.attitude, "---")}
                        </Text>
                    </View>
                    <View style={s.boxHeader}>
                        <Text style={s.boxHeaderText}>CONDUCT IN CLASS</Text>
                        <Text style={[s.remarksText, { marginHorizontal: 8 }]}>
                            {val(data.conduct?.attitude, "---")}
                        </Text>
                    </View>
                </View>

                <View>
                    <View style={s.boxHeader}>
                        <Text style={s.boxHeaderText}>INTERESTS</Text>
                        <Text style={[s.remarksText, { marginHorizontal: 8 }]}>
                            {val(data.conduct?.attitude, "---")}
                        </Text>
                    </View>
                    <View style={s.boxHeader}>
                        <Text style={s.boxHeaderText}>TEACHER REMARKS</Text>
                        <Text style={[s.remarksText, { marginHorizontal: 8 }]}>
                            {val(data.conduct?.attitude, "---")}
                        </Text>
                    </View>
                </View>

                {/* Attitude and Conduct*/}
                {/* <View style={[s.bottomRow, { marginBottom: 2 }]}> */}
                {/*     <View style={s.remarksBox}> */}
                {/*         <View style={s.boxHeader}> */}
                {/*             <Text style={s.boxHeaderText}>ATTITUDE IN CLASS</Text> */}
                {/*         </View> */}
                {/*         <View style={s.boxBody}> */}
                {/*             <Text style={s.remarksText}> */}
                {/*                 {val(data.conduct?.attitude, "No remarks provided.")} */}
                {/*             </Text> */}
                {/*         </View> */}
                {/*     </View> */}
                {/**/}
                {/* <View style={s.remarksBox}> */}
                {/*     <View style={s.boxHeader}> */}
                {/*         <Text style={s.boxHeaderText}>CONDUCT IN CLASS</Text> */}
                {/*     </View> */}
                {/*     <View style={s.boxBody}> */}
                {/*         <Text style={s.remarksText}> */}
                {/*             {val(data.conduct?.conduct, "No conduct provided.")} */}
                {/*         </Text> */}
                {/*     </View> */}
                {/* </View> */}

                {/* </View> */}


                {/* Footer */}
                <View style={s.footer}>
                    <Text style={s.footerLeft}>IDEA International School · Accra, Ghana</Text>
                    <Text style={s.footerCenter}>
                        Confidential — For Parent / Guardian Use Only
                    </Text>
                    <Text style={s.footerRight}>{val(data.academicTerm)} · {val(new Date().getFullYear())}</Text>
                </View>

            </View>
        </Page>
    </Document>
);

