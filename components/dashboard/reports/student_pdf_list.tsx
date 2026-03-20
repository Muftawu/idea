"use client"
import { StudentSchemaT } from '@/lib/schemas';
import { Font, Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { LetterHead } from './letter_head';
import { pageStyles } from './sytles';

// const MetaField = ({ label, value }: { label: string; value: string; }) => (
//     <View style={letterheadStyles.metaField}>
//         <Text style={letterheadStyles.metaLabel}>{label}</Text>
//         <Text style={[letterheadStyles.metaValue, letterheadStyles.metaValueHighlight]}>
//             {value}
//         </Text>
//     </View>
// );

// const VendorReportTable = ({ items }: { items: VendorDTOType[] }) => (
//     <View style={tableStyles.table}>
//         <View style={tableStyles.tableHeader}>
//             <Text style={tableStyles.tableHeaderCell}>#</Text>
//             <Text style={[tableStyles.tableHeaderCell, { flex: 2 }]}>Name</Text>
//             <Text style={[tableStyles.tableHeaderCell, { flex: 2 }]}>Phone</Text>
//             <Text style={[tableStyles.tableHeaderCell, { flex: 3 }]}>Location</Text>
//             <Text style={[tableStyles.tableHeaderCell, { textAlign: 'right' }]}>MenuItems</Text>
//         </View>
//
//         {items.map((item, index) => (
//             <View
//                 key={item.id}
//                 style={[
//                     tableStyles.tableRow,
//                     index % 2 === 0 ? tableStyles.tableRowEven : tableStyles.tableRowOdd,
//                 ]}
//             >
//                 <Text style={tableStyles.tableCell}>{index + 1}</Text>
//                 <Text style={[tableStyles.tableCellBold, { flex: 2 }]}>{item.name}</Text>
//                 <Text style={[tableStyles.tableCell, { flex: 2 }]}>{item.phone}</Text>
//                 <Text style={[tableStyles.tableCell, { flex: 3 }]}>{item.primaryLocation ?? "---"}</Text>
//                 <Text style={[tableStyles.tableCell, { textAlign: 'center' }]}>{item.menu?.length}</Text>
//             </View>
//         ))}
//
//         <View style={tableStyles.tableSummaryRow}>
//             <Text style={tableStyles.tableSummaryCell}>Total</Text>
//             <Text style={[tableStyles.tableSummaryCell, { flex: 3 }]}>{items.length} items</Text>
//             <Text style={[tableStyles.tableSummaryCell, { flex: 2 }]} />
//             <Text style={[tableStyles.tableSummaryCell, { flex: 2 }]} />
//             {/* <Text style={[tableStyles.tableSummaryCellValue, { textAlign: 'right' }]}> */}
//             {/*     {items.reduce((sum, i) => sum + parseFloat(i.value.replace(/[^0-9.]/g, '') || '0'), 0).toFixed(2)} */}
//             {/* </Text> */}
//         </View>
//     </View>
// );
//
// const OrderReportTable = ({ items }: { items: OrderDTOType[] }) => (
//     <View style={tableStyles.table}>
//         <View style={tableStyles.tableHeader}>
//             <Text style={tableStyles.tableHeaderCell}>#</Text>
//             <Text style={[tableStyles.tableHeaderCell, { flex: 3 }]}>Customer</Text>
//             <Text style={[tableStyles.tableHeaderCell, { flex: 2 }]}>Phone</Text>
//             {/* <Text style={[tableStyles.tableHeaderCell, { flex: 2 }]}>Package</Text> */}
//             <Text style={[tableStyles.tableHeaderCell, { flex: 2 }]}>Total</Text>
//             <Text style={[tableStyles.tableHeaderCell, { flex: 3 }]}>Location</Text>
//             <Text style={[tableStyles.tableHeaderCell, { flex: 2 }]}>Payment</Text>
//             <Text style={[tableStyles.tableHeaderCell, { textAlign: 'right' }]}>Biker</Text>
//         </View>
//
//         {items.map((item, index) => (
//             <View
//                 key={item.id}
//                 style={[
//                     tableStyles.tableRow,
//                     index % 2 === 0 ? tableStyles.tableRowEven : tableStyles.tableRowOdd,
//                 ]}
//             >
//                 <Text style={tableStyles.tableCell}>{index + 1}</Text>
//                 <Text style={[tableStyles.tableCellBold, { flex: 3 }]}>{item.customerInfo.first_name} {item.customerInfo.last_name}</Text>
//                 <Text style={[tableStyles.tableCell, { flex: 2 }]}>{item.customerInfo.phone}</Text>
//                 {/* <Text style={[tableStyles.tableCell, { flex: 2 }]}>{item.menuItemsList.map((item) => (<Text>{item.menuItems.name}</Text>))}</Text> */}
//                 <Text style={[tableStyles.tableCell, { flex: 2 }]}>{item.subtotal.toFixed(2)}</Text>
//                 <Text style={[tableStyles.tableCell, { flex: 3 }]}>{item.locationData.displayName}</Text>
//                 <Text style={[tableStyles.tableCell, { flex: 2, textAlign: 'center' }]}>{item.paymentConfirmed ? "Y" : "N"}</Text>
//                 <Text style={[tableStyles.tableCell, { flex: 2, textAlign: 'center' }]}>{item.riderDispatched ? "Y" : "N"}</Text>
//                 {/* <View style={{ flex: 2 }}> */}
//                 {/*     <View style={[ */}
//                 {/*         tableStyles.badge, */}
//                 {/*         item.customerLocationCaptured ? tableStyles.badgeGreen : tableStyles.badgeBlue */}
//                 {/*     ]}> */}
//                 {/*         <Text style={[ */}
//                 {/*             tableStyles.badgeText, */}
//                 {/*             item.customerLocationCaptured ? tableStyles.badgeTextGreen : tableStyles.badgeTextBlue */}
//                 {/*         ]}> */}
//                 {/*             {item.customerLocationCaptured ? "A" : "N/A"} */}
//                 {/*         </Text> */}
//                 {/*     </View> */}
//                 {/* </View> */}
//                 {/* <View style={{ flex: 2 }}> */}
//                 {/*     <View style={[ */}
//                 {/*         tableStyles.badge, */}
//                 {/*         item.paymentConfirmed ? tableStyles.badgeGreen : tableStyles.badgeBlue */}
//                 {/*     ]}> */}
//                 {/*         <Text style={[ */}
//                 {/*             tableStyles.badgeText, */}
//                 {/*             item.paymentConfirmed ? tableStyles.badgeTextGreen : tableStyles.badgeTextBlue */}
//                 {/*         ]}> */}
//                 {/*             {item.paymentConfirmed ? "A" : "N/A"} */}
//                 {/*         </Text> */}
//                 {/*     </View> */}
//                 {/* </View> */}
//                 {/* <View style={{ flex: 2 }}> */}
//                 {/*     <View style={[ */}
//                 {/*         tableStyles.badge, */}
//                 {/*         item.riderDispatched ? tableStyles.badgeGreen : tableStyles.badgeBlue */}
//                 {/*     ]}> */}
//                 {/*         <Text style={[ */}
//                 {/*             tableStyles.badgeText, */}
//                 {/*             item.riderDispatched ? tableStyles.badgeTextGreen : tableStyles.badgeTextBlue */}
//                 {/*         ]}> */}
//                 {/*             {item.riderDispatched ? "A" : "N/A"} */}
//                 {/*         </Text> */}
//                 {/*     </View> */}
//                 {/* </View> */}
//             </View>
//         ))}
//
//         <View style={tableStyles.tableSummaryRow}>
//             <Text style={tableStyles.tableSummaryCell}>Total</Text>
//             <Text style={[tableStyles.tableSummaryCell, { flex: 3 }]}>{items.length} items</Text>
//             <Text style={[tableStyles.tableSummaryCell, { flex: 2 }]} />
//             <Text style={[tableStyles.tableSummaryCell, { flex: 2 }]} />
//         </View>
//     </View>
// );
//

export const StudentPDFList = ({data}: { data: StudentSchemaT[]}) => (
    <Document title="All Student List" author="IdeaInternationalSchool">
        <Page style={pageStyles.body}>

            <View style={pageStyles.fixedHeader} fixed>
                <Text style={pageStyles.fixedHeaderText}>{}</Text>
                <Text style={pageStyles.fixedHeaderText}>#{}</Text>
            </View>

            <LetterHead title="Student list" createdBy="Muftawu" />

            <View style={pageStyles.sectionHeader}>
                <Text style={pageStyles.sectionTitle}>All Students List</Text>
                <Text style={pageStyles.sectionSub}>{data.length} records found</Text>
            </View>

            {/* <View style={styles.footerNote}> */}
            {/*     <Text style={styles.footerNoteText}> */}
            {/*         This report was automatically generated for audit purposes. Do not distribute without authorisation. */}
            {/*     </Text> */}
            {/* </View> */}

            <Text
                style={pageStyles.pageNumber}
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                fixed
            />

        </Page>
    </Document>
);

