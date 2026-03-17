"use client"
import { Font, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { letterheadStyles, pageStyles, } from './sytles';

const MetaField = ({ label, value }: { label: string; value: string; }) => (
    <View style={letterheadStyles.metaField}>
        <Text style={letterheadStyles.metaLabel}>{label}</Text>
        <Text style={[letterheadStyles.metaValue, letterheadStyles.metaValueHighlight]}>
            {value}
        </Text>
    </View>
);

export const LetterHead = ({title, createdBy}: {title: string, createdBy: string}) => (

    <Document title={title} author={createdBy}>
        <Page style={pageStyles.body}>

            <View style={pageStyles.fixedHeader} fixed>
                <Text style={pageStyles.fixedHeaderText}>{}</Text>
                <Text style={pageStyles.fixedHeaderText}>#{}</Text>
            </View>

            <View style={letterheadStyles.wrapper}>

                <View style={letterheadStyles.accentBar} />
                <View style={letterheadStyles.headerRow}>
                    <Image
                        style={letterheadStyles.logo}
                        src={""}
                    />
                    <View style={letterheadStyles.titleBlock}>
                        <Text style={letterheadStyles.companyName}>LINGO</Text>
                        <Text style={letterheadStyles.reportTitle}>{title}</Text>
                        <Text style={letterheadStyles.reportSub}>Report — {title}</Text>
                    </View>
                    <View style={letterheadStyles.idBadge}>
                        <Text style={letterheadStyles.idLabel}>REPORT ID</Text>
                        <Text style={letterheadStyles.idValue}>#{title}</Text>
                    </View>
                </View>
                <View style={letterheadStyles.divider} />
                <View style={letterheadStyles.metaGrid}>
                    <MetaField label="Created By" value={title} />
                    <MetaField label="Date Created" value={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} />
                    <MetaField label="Report Type" value={title} />
                    <MetaField label="Generated At" value={new Date().toLocaleTimeString()} />
                    {/* <MetaField label="Status" value="Finalised" highlight /> */}
                    {/* <MetaField label="Notes" value={data.notes} ?? "N/A"} /> */}
                </View>
                <View style={letterheadStyles.dividerThick} />
            </View>

            <Text
                style={pageStyles.pageNumber}
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                fixed
            />

        </Page>
    </Document>
);

