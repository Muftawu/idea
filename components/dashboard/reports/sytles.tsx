"use client"
import { Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

const BRAND = '#00A1FF';
const BORDER_COLOR = '#e2e8f0';

const BRAND_ACCENT = '#2563eb';
const BRAND_LIGHT = '#f1f5f9';
const TEXT_MUTED = '#64748b';

export const letterheadStyles = StyleSheet.create({
    wrapper: {
        marginBottom: 20,
    },
    accentBar: {
        height: 5,
        backgroundColor: BRAND_ACCENT,
        marginBottom: 0,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BRAND,
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    logo: {
        height: 48,
        width: 48,
        marginRight: 16,
    },
    titleBlock: {
        flex: 1,
        flexDirection: 'column',
    },
    companyName: {
        fontSize: 9,
        // color: BRAND,
        fontFamily: 'Oswald',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        marginBottom: 3,
    },
    reportTitle: {
        fontSize: 18,
        color: '#ffffff',
        fontFamily: 'Oswald',
        marginBottom: 2,
    },
    reportSub: {
        fontSize: 9,
        // color: '#94a3b8',
        fontFamily: 'Times-Roman',
    },
    idBadge: {
        backgroundColor: "#94a3b8",
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignItems: 'center',
    },
    idLabel: {
        fontSize: 7,
        color: '#bfdbfe',
        fontFamily: 'Oswald',
        letterSpacing: 1,
        marginBottom: 2,
    },
    idValue: {
        fontSize: 13,
        color: '#ffffff',
        fontFamily: 'Oswald',
    },
    divider: {
        height: 1,
        backgroundColor: BORDER_COLOR,
    },
    dividerThick: {
        height: 2,
        backgroundColor: BRAND_ACCENT,
        marginTop: 0,
    },
    metaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: BRAND_LIGHT,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: BORDER_COLOR,
    },
    metaField: {
        width: '33.33%',
        marginBottom: 8,
    },
    metaLabel: {
        fontSize: 7,
        color: TEXT_MUTED,
        fontFamily: 'Oswald',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 10,
        color: BRAND,
        fontFamily: 'Times-Roman',
    },
    metaValueHighlight: {
        color: '#16a34a',
        fontFamily: 'Oswald',
    },
});

export const pageStyles = StyleSheet.create({
    body: {
        paddingTop: 24,
        paddingBottom: 60,
        paddingHorizontal: 35,
    },
    fixedHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 6,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
    },
    fixedHeaderText: {
        fontSize: 7,
        color: TEXT_MUTED,
        fontFamily: 'Oswald',
        letterSpacing: 0.5,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 6,
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Oswald',
        color: BRAND,
    },
    sectionSub: {
        fontSize: 9,
        color: TEXT_MUTED,
        fontFamily: 'Times-Roman',
    },
    footerNote: {
        marginTop: 16,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: BORDER_COLOR,
    },
    footerNoteText: {
        fontSize: 8,
        color: TEXT_MUTED,
        fontFamily: 'Times-Roman',
        textAlign: 'center',
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 9,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: TEXT_MUTED,
        fontFamily: 'Oswald',
    },
});

export const tableStyles = StyleSheet.create({
    table: {
        width: '100%',
        marginTop: 4,
        marginBottom: 8,
        borderRadius: 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: BORDER_COLOR,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: BRAND,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    tableHeaderCell: {
        flex: 1,
        fontSize: 9,
        fontFamily: 'Oswald',
        color: '#ffffff',
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        alignItems: 'center',
    },
    tableRowEven: { backgroundColor: '#f8fafc' },
    tableRowOdd: { backgroundColor: '#ffffff' },
    tableCell: {
        flex: 1,
        fontSize: 9,
        color: '#334155',
        fontFamily: 'Times-Roman',
    },
    tableCellBold: {
        flex: 1,
        fontSize: 9,
        color: BRAND,
        fontFamily: 'Oswald',
    },
    badge: {
        borderRadius: 99,
        paddingVertical: 2,
        paddingHorizontal: 7,
        alignSelf: 'flex-start',
    },
    badgeGreen: { backgroundColor: '#dcfce7' },
    badgeBlue: { backgroundColor: '#dbeafe' },
    badgeText: {
        fontSize: 8,
        fontFamily: 'Oswald',
    },
    badgeTextGreen: { color: '#16a34a' },
    badgeTextBlue: { color: '#1d4ed8' },
    tableSummaryRow: {
        flexDirection: 'row',
        paddingVertical: 9,
        paddingHorizontal: 10,
        backgroundColor: BRAND,
    },
    tableSummaryCell: {
        flex: 1,
        fontSize: 9,
        color: '#ffffff',
        fontFamily: 'Oswald',
    },
    tableSummaryCellValue: {
        flex: 1,
        fontSize: 9,
        color: '#ffffff',
        fontFamily: 'Oswald',
    },
});
