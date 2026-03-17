"use client";

/**
 * IDEA International School — Class Student List
 * Built with @react-pdf/renderer
 *
 * Usage:
 *   import { ClassStudentList, DownloadClassListButton } from "./IdeaClassList"
 *
 *   <DownloadClassListButton data={classData} />
 *   // or preview inline:
 *   <PDFViewer width="100%" height="800px"><ClassStudentList data={classData} /></PDFViewer>
 *
 * Install deps:
 *   npm install @react-pdf/renderer
 */

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";

// ─── Types ────────────────────────────────────────────────────────────────────

export type StudentEntry = {
  indexNumber: string;
  surname: string;
  otherNames: string;
  gender: "m" | "f" | "M" | "F";
  dateOfBirth: string;         // e.g. "12 Jan 2018"
  section?: string;            // e.g. "A", "B"
  parentContact: string;
  photoUrl?: string;           // optional base64 or URL
};

export type ClassListData = {
  className: string;           // e.g. "Primary 3"
  section?: string;            // e.g. "A"
  term: string;                // e.g. "1st Term"
  year: string;                // e.g. "2024 / 2025"
  teacherName: string;
  teacherContact?: string;
  students: StudentEntry[];
};

// ─── Colors ───────────────────────────────────────────────────────────────────

const C = {
  brand:        "#ff6501",
  brandDark:    "#cc5100",
  brandLight:   "#fff3eb",
  brandMid:     "#ffd4b0",
  black:        "#1a1a1a",
  dark:         "#2d2d2d",
  mid:          "#555555",
  muted:        "#999999",
  border:       "#e8e0da",
  borderStrong: "#d0c4ba",
  bg:           "#fdfaf7",
  white:        "#ffffff",
  rowAlt:       "#fdf6f0",
  male:         "#1d6fa4",
  maleBg:       "#e8f4fd",
  female:       "#a0267a",
  femaleBg:     "#fdf0f8",
  statBg:       "#fff8f3",
};

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    fontSize: 6.5,
    color: C.muted,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 10,
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
    fontSize: 8.5,
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
  colNo:       { width: "5%",  paddingLeft: 10 },
  colPhoto:    { width: "9%",  alignItems: "center" },
  colIndex:    { width: "12%" },
  colName:     { width: "26%" },
  colGender:   { width: "8%",  alignItems: "center" },
  colDob:      { width: "13%" },
  colSection:  { width: "8%",  alignItems: "center" },
  colContact:  { width: "19%" },

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
    width: 30,
    height: 30,
    borderRadius: 4,
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
  footerLeft:   { fontSize: 7, color: C.muted },
  footerCenter: { fontSize: 7, color: C.muted, textAlign: "center", flex: 1, marginHorizontal: 8 },
  footerRight:  { fontSize: 7, color: C.muted, textAlign: "right" },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isMale = (g: string) => g?.toLowerCase() === "m";

const initials = (student: StudentEntry) =>
  `${student.surname?.[0] ?? ""}${student.otherNames?.[0] ?? ""}`.toUpperCase();

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

const PhotoCell = ({ student }: { student: StudentEntry }) => (
  <View style={s.photoBox}>
    {student.photoUrl ? (
      <Image src={student.photoUrl} style={{ width: 30, height: 30, objectFit: "cover" }} />
    ) : (
      <Text style={s.photoPlaceholderText}>{initials(student)}</Text>
    )}
  </View>
);

const StudentRow = ({ student, index }: { student: StudentEntry; index: number }) => (
  <View style={[s.tableRow, index % 2 === 1 ? s.tableRowAlt : {}]} wrap={false}>
    {/* # */}
    <View style={s.colNo}>
      <Text style={s.tdNo}>{String(index + 1).padStart(2, "0")}</Text>
    </View>

    {/* Photo */}
    <View style={s.colPhoto}>
      <PhotoCell student={student} />
    </View>

    {/* Index No */}
    <View style={s.colIndex}>
      <Text style={s.tdIndex}>{student.indexNumber || "—"}</Text>
    </View>

    {/* Name */}
    <View style={s.colName}>
      <Text style={s.tdNameSurname}>{student.surname}</Text>
      <Text style={s.tdNameOther}>{student.otherNames}</Text>
    </View>

    {/* Gender */}
    <View style={s.colGender}>
      <GenderPill gender={student.gender} />
    </View>

    {/* DOB */}
    <View style={s.colDob}>
      <Text style={s.tdDob}>{student.dateOfBirth || "—"}</Text>
    </View>

    {/* Section */}
    <View style={s.colSection}>
      {student.section ? (
        <View style={s.sectionPill}>
          <Text style={s.sectionPillText}>{student.section}</Text>
        </View>
      ) : (
        <Text style={[s.tdDob, { color: C.muted }]}>—</Text>
      )}
    </View>

    {/* Parent Contact */}
    <View style={s.colContact}>
      <Text style={s.tdContact}>{student.parentContact || "—"}</Text>
    </View>
  </View>
);

// ─── Page Footer (fixed) ──────────────────────────────────────────────────────

const PageFooter = ({ data }: { data: ClassListData }) => (
  <View style={s.footer} fixed>
    <Text style={s.footerLeft}>IDEA International School · Accra, Ghana</Text>
    <Text style={s.footerCenter}>Confidential — For Internal Use Only</Text>
    <Text
      style={s.footerRight}
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} of ${totalPages}  ·  ${data.term} ${data.year}`
      }
    />
  </View>
);

// ─── Main Document ────────────────────────────────────────────────────────────

export const ClassStudentList = ({ data }: { data: ClassListData }) => {
  const males   = data.students.filter((s) => isMale(s.gender)).length;
  const females = data.students.length - males;

  return (
    <Document
      title={`${data.className} Student List — ${data.term}`}
      author="IDEA International School"
      subject="Class Student List"
    >
      <Page size="A4" style={s.page} orientation="landscape">

        {/* ── Header (fixed, repeats on each page) ── */}
        <View style={s.headerBand} fixed>
          <View>
            <Text style={s.schoolName}>IDEA International School</Text>
            <Text style={s.schoolSub}>Creche · Nursery · Kindergarten · Primary · Basic 9</Text>
            <Text style={s.schoolContact}>
              6to6 Soldier Man St · P.O. Box 332 NM, Accra · Tel: 0302 435 836 / 0240 301 438
            </Text>
          </View>
          <View style={s.reportBadge}>
            <Text style={s.reportBadgeTop}>CLASS REGISTER</Text>
            <Text style={s.reportBadgeMain}>Student List</Text>
          </View>
        </View>
        <View style={s.accentStripe} fixed />

        {/* ── Body ── */}
        <View style={s.body}>

          {/* Class Info Card */}
          <View style={s.infoCard}>
            <View style={s.infoCardHeader}>
              <View style={s.infoCardDot} />
              <Text style={s.infoCardTitle}>CLASS INFORMATION</Text>
            </View>
            <View style={s.infoGrid}>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>CLASS</Text>
                <Text style={s.infoValue}>
                  {data.className}{data.section ? ` — Section ${data.section}` : ""}
                </Text>
              </View>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>TERM</Text>
                <Text style={s.infoValue}>{data.term}</Text>
              </View>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>ACADEMIC YEAR</Text>
                <Text style={s.infoValue}>{data.year}</Text>
              </View>
              <View style={s.infoCell}>
                <Text style={s.infoLabel}>CLASS TEACHER</Text>
                <Text style={s.infoValue}>{data.teacherName}</Text>
                {data.teacherContact && (
                  <Text style={s.infoValueSub}>{data.teacherContact}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Stats Row */}
          <View style={s.statsRow}>
            {[
              { label: "TOTAL STUDENTS", value: data.students.length, color: C.brand },
              { label: "MALE",           value: males,                 color: C.male  },
              { label: "FEMALE",         value: females,               color: C.female},
            ].map((stat, i, arr) => (
              <View
                key={stat.label}
                style={[s.statCard, i === arr.length - 1 ? s.statCardLast : {}]}
              >
                <Text style={[s.statNumber, { color: stat.color }]}>{stat.value}</Text>
                <Text style={s.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Section Heading */}
          <View style={s.sectionHeading}>
            <View style={s.sectionLine} />
            <Text style={s.sectionTitle}>ENROLLED STUDENTS</Text>
          </View>

          {/* Table */}
          <View style={s.table}>
            {/* Table Header */}
            <View style={s.tableHeaderRow} fixed>
              <View style={s.colNo}>
                <Text style={s.thText}>#</Text>
              </View>
              <View style={s.colPhoto}>
                <Text style={s.thText}>PHOTO</Text>
              </View>
              <View style={s.colIndex}>
                <Text style={s.thText}>INDEX NO.</Text>
              </View>
              <View style={s.colName}>
                <Text style={s.thText}>FULL NAME</Text>
              </View>
              <View style={s.colGender}>
                <Text style={[s.thText, { textAlign: "center" }]}>GENDER</Text>
              </View>
              <View style={s.colDob}>
                <Text style={s.thText}>DATE OF BIRTH</Text>
              </View>
              <View style={s.colSection}>
                <Text style={[s.thText, { textAlign: "center" }]}>SECTION</Text>
              </View>
              <View style={s.colContact}>
                <Text style={s.thText}>PARENT CONTACT</Text>
              </View>
            </View>

            {/* Student Rows */}
            {data.students.map((student, i) => (
              <StudentRow key={student.indexNumber || i} student={student} index={i} />
            ))}
          </View>

          {/* Signature + Note */}
          <View style={s.bottomRow}>
            <View style={s.signBox}>
              <View style={s.boxHeader}>
                <Text style={s.boxHeaderText}>CLASS TEACHER'S SIGNATURE</Text>
              </View>
              <View style={s.boxBody}>
                <View style={s.signLine} />
                <Text style={s.signLabel}>Class Teacher</Text>
              </View>
            </View>
            <View style={s.signBox}>
              <View style={s.boxHeader}>
                <Text style={s.boxHeaderText}>HEAD TEACHER'S SIGNATURE</Text>
              </View>
              <View style={s.boxBody}>
                <View style={s.signLine} />
                <Text style={s.signLabel}>Head Teacher</Text>
              </View>
            </View>
            <View style={s.noteBox}>
              <View style={s.boxHeader}>
                <Text style={s.boxHeaderText}>NOTE</Text>
              </View>
              <View style={s.boxBody}>
                <Text style={s.noteText}>
                  This document is an official class register for {data.className} — {data.term}, {data.year}.
                  It is confidential and intended for administrative use only.
                  Any updates to student records should be reported to the school administration promptly.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fixed Footer with page numbers */}
        <PageFooter data={data} />
      </Page>
    </Document>
  );
};

// ─── Sample Data ──────────────────────────────────────────────────────────────

export const sampleClassData: ClassListData = {
  className: "Primary 3",
  section: "A",
  term: "1st Term",
  year: "2024 / 2025",
  teacherName: "Mrs. Abena Mensah",
  teacherContact: "0244 567 890",
  students: [
    { indexNumber: "IIS/2024/001", surname: "Asante",     otherNames: "Kwame John",       gender: "m", dateOfBirth: "14 Mar 2016", section: "A", parentContact: "0244 123 456" },
    { indexNumber: "IIS/2024/002", surname: "Boateng",    otherNames: "Akua Grace",        gender: "f", dateOfBirth: "02 Jun 2016", section: "A", parentContact: "0554 234 567" },
    { indexNumber: "IIS/2024/003", surname: "Darko",      otherNames: "Kofi Emmanuel",     gender: "m", dateOfBirth: "22 Sep 2015", section: "A", parentContact: "0208 345 678" },
    { indexNumber: "IIS/2024/004", surname: "Mensah",     otherNames: "Ama Serwa",         gender: "f", dateOfBirth: "07 Jan 2016", section: "A", parentContact: "0277 456 789" },
    { indexNumber: "IIS/2024/005", surname: "Ofori",      otherNames: "Yaw Benjamin",      gender: "m", dateOfBirth: "19 Nov 2015", section: "A", parentContact: "0244 567 890" },
    { indexNumber: "IIS/2024/006", surname: "Amponsah",   otherNames: "Adwoa Cecilia",     gender: "f", dateOfBirth: "30 Apr 2016", section: "A", parentContact: "0501 678 901" },
    { indexNumber: "IIS/2024/007", surname: "Tetteh",     otherNames: "Nii Armah",         gender: "m", dateOfBirth: "11 Aug 2015", section: "A", parentContact: "0244 789 012" },
    { indexNumber: "IIS/2024/008", surname: "Owusu",      otherNames: "Abena Felicia",     gender: "f", dateOfBirth: "25 Feb 2016", section: "A", parentContact: "0554 890 123" },
    { indexNumber: "IIS/2024/009", surname: "Frimpong",   otherNames: "Kwabena Samuel",    gender: "m", dateOfBirth: "08 Dec 2015", section: "A", parentContact: "0208 901 234" },
    { indexNumber: "IIS/2024/010", surname: "Adomako",    otherNames: "Akosua Priscilla",  gender: "f", dateOfBirth: "16 Jul 2016", section: "A", parentContact: "0277 012 345" },
  ],
};

// ─── Download Button ──────────────────────────────────────────────────────────

export const DownloadClassListButton = ({ data }: { data: ClassListData }) => (
  <PDFDownloadLink
    document={<ClassStudentList data={data} />}
    fileName={`${data.className.replace(/\s+/g, "_")}_${data.term.replace(/\s+/g, "_")}_StudentList.pdf`}
  >
    {({ loading }) => (loading ? "Generating PDF…" : "Download Class List")}
  </PDFDownloadLink>
);
